import React, { useEffect, useState } from "react";
import { API, Storage } from 'aws-amplify';
import { listNotes } from "../graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation
} from "../graphql/mutations";
import {
  Button,
  Flex,
  Image,
  Text,
  TextField,
  View
} from '@aws-amplify/ui-react';

export function PrivateBoard() {
  const [notes, setNotes] = useState([]);
  
  async function fetchNotes() { //safe to define the fetch functions outside useEffect
    const apiData = await API.graphql({ query: listNotes, authMode: 'AMAZON_COGNITO_USER_POOLS' }); //Need to include authMode here in addition to changning @auth in schema
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return(

    <View className = 'App'>

      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <Text fontWeight={"bold"}>Create a private note:</Text>
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>

      <View margin="3rem 0">
      {notes.map((note) => (
        <Flex
        key={note.id || note.name}
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
          <Text as="strong" fontWeight={700}>
            {note.name}
          </Text>
          <Text as="span">{note.description}</Text>
            {note.image && (
          <Image
            src={note.image}
            alt={`visual aid for ${notes.name}`}
            style={{ width: 400 }}
          />
            )}
          <Button variation="link" onClick={() => deleteNote(note)}>
            Delete note
          </Button>
        </Flex>
      ))}
      </View>

    </View>

  );
}