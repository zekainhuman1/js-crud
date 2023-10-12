// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

Track.create(
  'No More Tears',
  'Ozzy Osbourne',
  'https://picsum.photos/100',
)

Track.create(
  'Paranoid',
  'Black Sabbath',
  'https://picsum.photos/100',
)

Track.create(
  'Child In Time',
  'Deep Purple',
  'https://picsum.photos/100',
)

Track.create(
  'Spirit of the Sea',
  "Blackmore's Night",
  'https://picsum.photos/100',
)

console.log(Track.getList())

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrack(track) {
    this.tracks.push(track)
  }

  static findListByValue(value) {
    return this.#list.filter((palylist) =>
      palylist.name
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
  }
}

// ================================================================
router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.lenght,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.lenght,
      })),
      value,
    },
  })
})

router.get('/', function (req, res) {
  const playlists = Playlist.getList()
  // const tracksCount =  playlists.tracks.length
  // console.log(playlists.tracks.length)

  res.render('spotify-playlists', {
    style: 'spotify-playlists',
    data: {
      playlists,
      image: 'https://picsum.photos/290',
    },
  })
})

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
  })
})

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Плейлист створений',
      link: `/`,
    },
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const tracks = Track.getList()

  console.log(playlistId, tracks)

  if (!playlistId) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      playlistId,
      tracks,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const trackId = Number(req.query.trackId)
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-add', function (req, res) {
  const trackId = Number(req.query.trackId)
  const track = Track.getById(trackId)
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }

  playlist.addTrack(track)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
