const { getPlaylistsByMood } = require("./spotify.service")

const getPlaylists = async (req, res) => {
  try {
    const { mood } = req.params
    const playlists = await getPlaylistsByMood(mood)
    res.json(playlists)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getPlaylists }
