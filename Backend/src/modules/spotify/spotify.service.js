const getSpotifyToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    },
    body: "grant_type=client_credentials"
  })

  const data = await response.json()
  return data.access_token
}

const getPlaylistsByMood = async (mood) => {
  const token = await getSpotifyToken()

  const moodQueries = {
    concentrado: "focus study lofi",
    relajado: "chill relax peaceful",
    motivado: "motivation energy workout",
    feliz: "happy good vibes",
    neutral: "background music"
  }

  const query = moodQueries[mood] || moodQueries.neutral

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=5`,
    { headers: { "Authorization": `Bearer ${token}` } }
  )

  const data = await response.json()
  return data.playlists?.items || []
}

module.exports = { getPlaylistsByMood }
