import Spotify from "./spotifyAPI";

const routes = {};

routes.search = async (term) => {
  // if token is not create, search doesn't happen
  try {
      // get the token
      const userToken = await Spotify.getToken();
      const baseUrl = "https://api.spotify.com/v1/search?";
      const endpoint = `${baseUrl}q=${encodeURIComponent(
          term
      )}&type=track`;
      // Continue with search implementation
      const response = await fetch(endpoint, {
          headers: {
              Authorization: `Bearer ${userToken}`,
          },
      });
      if (response.ok) {
          const data = await response.json();
          // get correct data from response
          const items = data.tracks.items;
          // refactor returned objects into objects with needed data
          const finalArray = [];
          for (let item of items) {
              let track = {};
              track.name = item.name;
              track.id = item.id;
              track.album = item.album.name;
              track.artist = item.artists[0].name;
              track.previewUrl = item.preview_url;
              finalArray.push(track);
          }
          return finalArray;
      }
  } catch (error) {
      console.log(`There was an error when searching: ${error}`);
      return [];
  }
}

routes.handleCreateNewPlaylist = async (tracks, playlistName)=> {
  try {
      const token = await Spotify.getToken();
      const playlistObject = await routes.generatePlaylistData(
          tracks,
          playlistName
      );
      const userId = await routes.getUserId(token);
      const playlistId = await routes.createNewPlaylist(
          token,
          userId,
          playlistObject.name
      );

      await routes.addTracksToPlaylist(
          token,
          playlistId,
          playlistObject.trackURIs
      );
      console.log("playlist has been created.");
  } catch (error) {
      console.error(`Error handling playlist creation: ${error}`);
  }
}

routes.generatePlaylistData = async (tracks, playlistName) => {
  const trackURIs = [];
  for (let track of tracks) {
      trackURIs.push(`spotify:track:${encodeURI(track.id)}`);
  }
  return { name: playlistName, trackURIs: trackURIs };
}

routes.createNewPlaylist = async (userToken, userId, playlistName) =>{
  const endpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const response = await fetch(endpoint, {
      method: "POST",
      headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-type": "application/json",
      },
      body: JSON.stringify({
          name: playlistName,
          description: "A playlist generated using the Jammmin app!",
      }),
  });
  if (response.ok) {
      const data = await response.json();
      const playlistId = data.id;
      console.log("You new playlist has been created!");
      return playlistId;
  } else {
      throw new Error(
          `Create New Playlist: Status ${response.status}: ${response.message}`
      );
  }
}

routes.getUserId = async (userToken) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
          Authorization: `Bearer ${userToken}`,
      },
  });
  if (response.ok) {
      const data = await response.json();
      const user_id = data.id;
      return user_id;
  } else {
      throw new Error(
          `Get User ID: Status ${response.status}: ${response.message}`
      );
  }
}

routes.addTracksToPlaylist = async (userToken, playlistId, trackURIs) => {
  const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const response = await fetch(endpoint, {
      method: "POST",
      headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-type": "application/json",
      },
      body: JSON.stringify({
          uris: trackURIs,
          position: 0,
      }),
  });
  if (response.ok) {
      console.log("Tracks added to playlist");
  } else {
      throw new Error(
          `Add Tracks To Playlist: Status ${response.status}: ${response.message}`
      );
  }
}

routes.fetchProfile = async (token) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
  if (response.ok) {
      const result = await response.json();
      return result;
  } else {
      throw new Error(
          `Get User ID: Status ${response.status}: ${response.message}`
      );
  }
}

export default routes;