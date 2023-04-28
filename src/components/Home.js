import React, { useEffect, useState, useRef } from "react";
import { API, Auth} from 'aws-amplify'; //added auth to this to allow session information
import { listLogins } from "../graphql/queries";
import {
  createLogin as createLoginMutation,
  updateLogin as updateLoginMutation,
  deleteLogin as deleteLoginMutation
} from "../graphql/mutations";
import {
  Button,
  Flex,
  Heading,
  Text,
  View,
  useAuthenticator
} from '@aws-amplify/ui-react';

export function Home() {

  const [logins, setLogins] = useState([]);
  const { route, user } = useAuthenticator((context) => [context.route, context.user]);
  const loginRef = useRef(0);
console.log(loginRef);
  async function fetchLogins() {
    const apiData = await API.graphql({ query: listLogins, authMode: 'API_KEY' });
    const loginsFromAPI = apiData.data.listLogins.items;
    setLogins(loginsFromAPI);
  }
  
  async function deleteLogin({ id }) { //delete login - included to help debug the logins tracker by allowing deletion of login records on the frontend
    await API.graphql({
      query: deleteLoginMutation,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    fetchLogins();
  }

  useEffect(() => {

    async function loginHandler(route, loginRef) { //define this function inside the useEffect as it is called here
      if(route === "authenticated" && loginRef.current === 0){
        const token = await Auth.currentSession();
    
        const filterByUser = {
          filter: {
            userName: {
              eq: user.username
            }
          }
        };

        const previousLogin = await API.graphql({ query: listLogins, authMode: 'API_KEY', variables: filterByUser }); //fetch current user logins
    
        if(previousLogin && previousLogin.data.listLogins.items.length > 0) { //update current user login if it exists
          const loginData = {
            id: previousLogin.data.listLogins.items[0].id,
            loginTime: token.getAccessToken().payload.auth_time
          };

          await API.graphql({
            query: updateLoginMutation,
            variables: { input: loginData },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
          });

        } else { //create user login record on first login
          const loginData = {
            userName: user.username,
            loginTime: token.getAccessToken().payload.auth_time
          };
      
          await API.graphql({
            query: createLoginMutation,
            variables: { input: loginData },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
          });
        }

        //loginRef.current = 1; //ref to track if loginHandler has already been called - prevents multiple login records being created due to React strict mode calling effects twice

      }

      fetchLogins();
    }

    loginHandler(route, loginRef); //call to session handler that uploads login to database
    loginRef.current = 1;
  }, [route, user]);

  return (
    <View>
      <Heading level={5}>User Activity Log</Heading>
      <View margin="3rem 0">
      {logins.map((lgn) => (
      <Flex
      key={lgn.id || lgn.name}
      direction="row"
      justifyContent="center"
      alignItems="center"
      >
      <Text as="strong" fontWeight={700}>
      {lgn.userName}
      </Text>
      <Text as="span">{new Date(1000 * lgn.loginTime).toISOString()}</Text>
      <Button variation="link" onClick={() => deleteLogin(lgn)}>Delete Login</Button>
      </Flex>
      ))}
      </View>

    </View>
  );
}