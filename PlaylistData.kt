package com.mp3.myapplication


// 1. Modelo de canción
data class Song(
    val title: String,
    val artist: String,
    val album: String,
    val url: String,
    val image: String
)

// 2. Modelo de Álbum
data class Album(
    val name: String,
    val artist: String,
    val cover: String,
    val songs: List<Song>
)

// 3. Lista ÚNICA de canciones
val globalPlaylist = listOf(
    Song(
        title = "A Man Without Love",
        artist = "Engelbert Humperdinck",
        album = "My Album",
        url = "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Engelbert%20Humperdinck%20-%20A%20Man%20Without%20Love%20%28legendado%29.mp3",
        image = "https://i.pinimg.com/736x/49/6c/c4/496cc471a250666945be9b2ff96647d5.jpg"
    ),

    Song(
        title= "Tommee Profitt - Enemy (Sam Tinnesz Beacon Light)",
        artist= "Tommee Profitt",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FEnemy%20-%20Tommee%20Profitt%20Sam%20Tinnesz%20Beacon%20Light.mp3?alt=media&token=8b49905b-178b-4e7c-a7bc-e33fcfd3d843",
        image= "https://i.pinimg.com/736x/e3/da/a3/e3daa3883674cbec11feb44c3f01afe1.jpg",
    ),
    Song(
        title= "Egzod & Maestro Chives - Royalty (ft. Neoni)",
        artist= "Egzod & Maestro Chives",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FEgzod%20%26%20Maestro%20Chives%20-%20Royalty%20(ft.%20Neoni)%20%5BOfficial%20Lyric%20Video%5D.mp3?alt=media&token=1829d5e8-3ba2-4b5f-8e71-1d582b83ff46",
        image= "https://i1.sndcdn.com/artworks-DXrZ18rbgBvdZGhM-6SaGEQ-t500x500.jpg",
    ),
    Song(
        title= "Adele - Skyfall",
        artist= "Adele",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Adele%20-%20Skyfall%20.mp3",
        image= "https://i.scdn.co/image/ab67616d0000b2732737be35cc5245eef495be90",
    ),
    Song(
        title= "Avicii, ft Conrad Sewell - Taste The Feeling (Version Extendida) (Remasterizado)",
        artist= "szv_wav",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Taste%20The%20Feeling%20%28Avicii%20Vs.%20Conrad%20Sewell%29.mp3",
        image= "https://c-cdnet.cdn.smule.com/rs-s43/arr/53/89/dccacdac-37ec-4926-8b9e-f51dc27231af.jpg",
    ),
    Song (
        title= "Nirvana - Something In The Way",
        artist= "Nirvana",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FNirvana%20-%20Something%20In%20The%20Way%20(Audio).mp3?alt=media&token=40a4293a-0567-4c71-9211-1972e1f1ed4d",
        image= "https://i.pinimg.com/736x/51/0b/ee/510beebb59e33a485be7ada76870fae6.jpg",
    ),

    Song (
        title= "Bezos I x Gimme Gimme (TikTok)",
        artist= "katerina",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Bezos%20I%20x%20Gimme%20Gimme%20Gimme%20%28TikTok%20Mashup%29%20HQ.mp3",
        image= "https://i.pinimg.com/736x/14/e4/42/14e4427b0664d8550d4aea51b754883a.jpg",
    ),
    Song (
        title= "Meet the frownies x Lovely Bastards",
        artist= "ZWE1HVNDXR",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FMeet%20the%20frownies%20x%20Lovely%20Bastards.mp3?alt=media&token=204e9844-bc69-4032-9d51-0ca8b677324d",
        image= "https://i.pinimg.com/236x/1a/b9/ad/1ab9ada29ba018527facd105758a03ec.jpg",
    ),
    Song (
        title= "Old Town Road (ft. Billy) Ray Cyrus",
        artist= "Lil Nas X",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Lil%20Nas%20X%20-%20Old%20Town%20Road%20%28Official%20Video%29%20ft.%20Billy%20Ray%20Cyrus.mp3",
        image= "https://i.pinimg.com/736x/71/1e/a7/711ea7895e11cd5d550f28fcfeba2330.jpg",
    ),
    Song (
        title= "MGMT - Little Dark Age",
        artist= "MGMT",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/MGMT%20-%20Little%20Dark%20Age.mp3",
        image= "https://i.pinimg.com/736x/4a/a4/8c/4aa48c4429f9b945424c53c0ee164f4f.jpg",
    ),
    Song (
        title= "what I've done",
        artist= "Linkin Park",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Linkin%20Park%20-%20What%20I%20ve%20Done%5BHQ%5D.mp3",
        image= "https://i1.sndcdn.com/artworks-000601014187-dkidi9-t500x500.jpg",
    ),
    Song (
        title= "Aftermath",
        artist= "Caravan Palace",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FCaravan%20Palace%20-%20Aftermath%20__%20Sub%20Espa%C3%B1ol%20-%20steven%20fan.mp3?alt=media&token=a41addab-ea90-4911-a1ae-26f59d2db44b",
        image= "https://i.pinimg.com/736x/3f/05/25/3f05253ec7cabc2ae909690c17cd694e.jpg",
    ),
    Song (
        title= "The Rolling Stones",
        artist= "Paint It, Black",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FThe%20Rolling%20Stones%20-%20Paint%20It%2C%20Black%20(Official%20Lyric%20Video)%20-%20ABKCOVEVO.mp3?alt=media&token=1eefd2c7-81b1-4285-8116-6024ea70c676",
        image= "https://i.pinimg.com/736x/9e/03/17/9e03178556065707c4598feb9000a2fe.jpg",
    ),
    Song (
        title= "In The End",
        artist= "Linkin Park",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Linkin%20Park%20-%20In%20The%20End%20%28Mellen%20Gi%20%26%20Tommee%20Profitt%20Remix%29.mp3",
        image= "https://i1.sndcdn.com/artworks-yMgYpMVWpz8aYhDg-1ob3AA-t500x500.jpg",
    ),
    Song (
        title= "Post Malone, Swae Lee - Sunflower",
        artist= "Post Malone",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FPost%20Malone%2C%20Swae%20Lee%20-%20Sunflower%20(Spider-Man%20Into%20the%20Spider-Verse).mp3?alt=media",
        image= "https://i1.sndcdn.com/artworks-C9Iaa8IBy9cQ064Y-VsPIHg-t500x500.jpg",
    ),
    Song (
        title= "Am I Dreaming",
        artist= "Metro Boomin, AAP Rocky, Roisee",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FAm%20I%20Dreaming%20_%20Spider-Verse%20Soundtrack%20_%20Metro%20Boomin%2C%20AAP%20Rocky%2C%20Roisee%20_%20Sub%20Espa%C3%B1ol%20_%20Credits%20_%20-%20Syndornx.mp3?alt=media",
        image= "https://i.pinimg.com/736x/5e/c7/d0/5ec7d08a7ff643d6120dc869726e63df.jpg",
    ),
    Song (
        title= "Eminem - Venom",
        artist= "Eminem",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FEminem%20-%20Venom(Official%20Audio)%20-%20ch3vu.mp3?alt=media&token=7d3b2ed6-701a-4fb1-8efe-c76c077cad38",
        image= "https://i.pinimg.com/736x/df/5d/15/df5d1530129f004c62b79951f020f8cd.jpg",
    ),
    Song (
        title= "Last One Standing",
        artist= "Skylar Grey, Polo G, Mozzy, Eminem",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FSkylar%20Grey%2C%20Polo%20G%2C%20Mozzy%2C%20Eminem%20-%20Last%20One%20Standing%20(Lyric%20Video)%20-%20EminemVEVO.mp3?alt=media",
        image= "https://i.scdn.co/image/ab67616d0000b27318b2c39fa740e2822d40d65b",
    ),
    Song (
        title= "I ve Grown (After Dark)",
        artist= "I am ASH",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/I%20ve%20Grown%20From%20A%20Man%20To%20A%20God%20%28After%20Dark%29%20%28Music%20Visualizer%29.mp3",
        image= "https://i.scdn.co/image/ab67616d0000b2735da65dad4f031f51663ee444",
    ),
    Song (
        title= "The Neighbourhood - Sweater Weather",
        artist= "The Neighbourhood",
        album= "My Album",
        url= "https://colega-20.github.io/proyec/Musica/The%20Neighbourhood%20-%20Sweater%20Weather.mp3",
        image=
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fen%2F6%2F6c%2FSweater_Weather_(The_Neighborhood_single_cover).jpg&f=1&nofb=1&ipt=8cbb74a3f958b28b95240635dd636c47c167ea853edbbf3cd6e3ca9ec8767dcb&ipo=images",
    ),
    Song (
        title= "Sweater Weather x After Dark",
        artist= "Renzhoo",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Sweater%20Weather%20x%20After%20Dark%20%28Speed%20Up%29.mp3",
        image= "https://ideogram.ai/assets/progressive-image/balanced/response/yR5vZY9nSimvJkXOyb0COg",
    ),
    Song (
        title= "Mr.Kitty - After Dark",
        artist= "Mr.Kitty",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FMr.Kitty%20-%20After%20Dark%20-%20Mr.Kitty%20Official.mp3?alt=media",
        image= "https://ideogram.ai/assets/image/lossless/response/UjdJ6aLIQrO2CT5msh22zg",
    ),
    Song (
        title= "Wellerman (Sea Shanty)",
        artist= "Nathan Evans",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FNathan%20Evans%20-%20Wellerman%20(Sea%20Shanty).mp3?alt=media&token=8aad8ae1-c21b-4c4c-b0d5-bbe2352acb81",
        image= "https://i.scdn.co/image/ab67616d0000b273db24f6590f4ad36048076521",
    ),
    Song (
        title= "X Gon Give It To Ya",
        artist= "Multifandom",
        album= "My Album",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/X%20Gon%20Give%20It%20To%20Ya.mp3",
        image= "https://i.pinimg.com/736x/6b/d9/c5/6bd9c5e31777e6772c57de7c3e46f27a.jpg",
    ),
    Song (
        title= "Way Down We Go",
        artist= "KALEO",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FKALEO%20-%20Way%20Down%20We%20Go.mp3?alt=media&token=d7136d3c-ff9b-4ffa-a0f2-01cd86dbf69a",
        image=
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/19002d30-5808-433a-9b82-947570852a5d/dgb5nfq-7dd9eae0-63c8-49dc-81b1-fe3595e893d5.jpg/v1/fill/w_894,h_894,q_70,strp/samurai_vaporwave_aesthetic_by_pixl141_dgb5nfq-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcLzE5MDAyZDMwLTU4MDgtNDMzYS05YjgyLTk0NzU3MDg1MmE1ZFwvZGdiNW5mcS03ZGQ5ZWFlMC02M2M4LTQ5ZGMtODFiMS1mZTM1OTVlODkzZDUuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.cyT6voa-q51-0e8H3qDVl3qJ4X1vMEOU2U9MFMhWPeM",
    ),
    Song (
        title= "Gangstas Paradise",
        artist= "Coolio",
        album= "My Album",
        url= "https://colega-20.github.io/proyec/Musica/gangstas-paradise.mp3",
        image= "https://ideogram.ai/assets/image/lossless/response/OAS-fc9ERN2TD6H3LWXDsw",
    ),
    Song (
        title= "David Guetta - Hey Mama (ERS REMIX)",
        artist= "David Guetta",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FDavid%20Guetta%20-%20Hey%20Mama%20(ERS%20REMIX)%20.mp3?alt=media",
        image= "https://i.pinimg.com/736x/9f/90/46/9f9046d027629f4672d898878400482c.jpg",
    ),
    Song (
        title= "Ainsi bas la vida",
        artist= "Indila",
        album= "My Album",
        url= "https://colega-20.github.io/proyec/Musica/ainsi-bas-la-vida-full-version.mp3",
        image= "https://i.pinimg.com/736x/4f/26/75/4f26753050593ed873b9be73e5b709ab.jpg",
    ),
    Song (
        title= "Let It Die (ft. Philip Strand)",
        artist= "Rival",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FRival%20-%20Let%20It%20Die%20(ft.%20Philip%20Strand)%20%5BOfficial%20Lyric%20Video%5D%20-%20Rival.mp3?alt=media",
        image= "https://i.pinimg.com/736x/89/61/69/8961698b1238825eb61572ad9c4cd832.jpg",
    ),
    Song (
        title= "Bonly stay with me",
        artist= "Zeta Z",
        album= "My Album",
        url= "https://colega-20.github.io/proyec/Musica/nonly-stay-with-me.mp3",
        image= "https://i.pinimg.com/736x/8b/20/b8/8b20b81da70fc92aa042dd18bdf5147a.jpg",
    ),
    Song (
        title= "Sweet Dreams",
        artist= "Eurythmics, Annie Lennox, Dave Stewart",
        album= "My Album",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FEurythmics%2C%20Annie%20Lennox%2C%20Dave%20Stewart%20-%20Sweet%20Dreams%20(Are%20Made%20Of%20This)%20(Official%20Video).mp3?alt=media&token=f51cb1c6-a261-4ca5-b58a-e07370f9031f",
        image= "https://i.pinimg.com/736x/56/bf/4f/56bf4f69a40cf5cfcf7a44a5f4c81972.jpg",
    ),
    Song (
        title= "BABYDOLL SPEED",
        artist= "Ari Abdul",
        album= "My Album",
        url= "https://colega-20.github.io/proyec/Musica/BABYDOLL%20SPEED.mp3",
        image= "https://i.pinimg.com/736x/66/ba/38/66ba385c5aa7b1edad94dc66e9c53b92.jpg",
    ),
    ////////////////
    Song (
        title= "Beanie (Slowed)",
        artist= "Chezile",
        album= "Pasiva",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FBeanie%20(Slowed).mp3?alt=media&token=8c095f88-50e0-4b2c-8692-1d6c07e71a72",
        image= "https://i.pinimg.com/736x/bb/41/f7/bb41f7c39c240ecf95472413cd6de184.jpg",
    ),
    Song (
        title= "Akon - LonelySong (BASS BOOSTED}",
        artist= "Akon",
        album= "Pasiva",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FAkon%20-%20Lonely%20%7BBASS%20BOOSTED%7D.mp3?alt=media&token=4fb4c9b3-8656-4017-aa81-0dff7a1baa74",
        image= "https://i.pinimg.com/originals/e4/f7/24/e4f724d59b707ebf5ff1c86892abb0c6.jpg",
    ),
    Song (
        title= "Someone To You (feat. Shalom Margaret)",
        artist= "Fasetya",
        album= "Pasiva",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FFasetya%20-%20Someone%20To%20You%20(feat.%20Shalom%20Margaret).mp3?alt=media&token=76e754b9-d056-4483-a44f-f8a0c71634b3",
        image= "https://i.pinimg.com/736x/e9/7d/ef/e97def91ca1841c615c7fb8c53906a54.jpg",
    ),
    Song (
        title= "the one that got away (Gustixa Remix)",
        artist= "Gustixa",
        album= "Pasiva",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2Fthe%20one%20that%20got%20away%20(Gustixa%20Remix).mp3?alt=media&token=9004a5a1-e062-446e-94d9-8fe5f69f662a",
        image= "https://i.pinimg.com/736x/f5/b9/e4/f5b9e4d4e26b85941377930aafa58145.jpg",
    ),
    Song (
        title= "See You Again ft. Charlie Puth",
        artist= "Wiz Khalifa",
        album= "Pasiva",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FWiz%20Khalifa%20-%20See%20You%20Again%20ft.%20Charlie%20Puth.mp3?alt=media&token=9e56b5f0-b05b-485a-8497-cd652b96c1a6",
        image= "https://i1.sndcdn.com/artworks-000112918851-wrohig-t500x500.jpg",
    ),
    Song (
        title= "Lukas Graham - 7 Years",
        artist= "Lukas Graham",
        album= "Pasiva",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Lukas%20Graham%20-%207%20Years%20%28Lyrics%29.mp3",
        image= "https://i.pinimg.com/736x/db/0d/39/db0d39b14c05077746ff90deb712faec.jpg",
    ),
    Song (
        title= "M.T - Hoffnungslos",
        artist= "M.T",
        album= "Pasiva",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FM.T%20-%20Hoffnungslos.mp3?alt=media&token=459f3529-1cf6-4fad-a18a-b43b69b7fc51",
        image= "https://i.pinimg.com/736x/cc/8f/ac/cc8fac9c1d0896d01458497d619e3884.jpg",
    ),
    Song (
        title= "Cry - Cigarettes After Sex",
        artist= "Cigarettes After Sex",
        album= "Pasiva",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FCry%20-%20Cigarettes%20After%20Sex.mp3?alt=media&token=57dc6845-6a20-481e-bf40-819ae6127645",
        image= "https://i.pinimg.com/originals/f9/3c/fe/f93cfe14821d44e1174b4fcf62bfea38.jpg",
    ),


    Song(
        title= "Believer - Imagine Dragons",
        artist= "Imagine Dragons",
        album= "Imagine Dragons",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Imagine%20Dragons%20-%20Believer%20%28Audio%29.mp3",
        image= "https://i1.sndcdn.com/artworks-000417287439-z0hnqd-t500x500.jpg",
    ),
    Song(
        title= "Warriors - Imagine Dragons",
        artist= "Imagine Dragons",
        album= "Imagine Dragons",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FWarriors%20-%20Imagine%20Dragons.mp3?alt=media&token=6783dcda-bf74-48d9-9b4c-2fa64d0398bb",
        image= "https://lastfm.freetls.fastly.net/i/u/300x300/aed5e019e5f1419ec199a6f1ec658983.jpg",
    ),
    Song(
        title= "Enemy - Imagine Dragons",
        artist= "Imagine Dragons",
        album= "Imagine Dragons",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FImagine%20Dragons%20-%20Enemy%20(without%20rap%20_%20J.I.D%20_)%20Original%20Imagine%20Dragons%20Version%20-%20shhro.mp3?alt=media",
        image= "https://i.pinimg.com/736x/96/25/1e/96251ee9e068421406719a1d7db512eb.jpg",
    ),
    Song(
        title= "Imagine Dragons - Bones",
        artist= "Imagine Dragons",
        album= "Imagine Dragons",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FImagine%20Dragons%20-%20Bones%20(Official%20Lyric%20Video)%20-%20ImagineDragonsVEVO.mp3?alt=media",
        image= "https://i.pinimg.com/736x/a0/29/43/a029435cb8db724c5737f72a51b01c52.jpg",
    ),
    Song(
        title= "Imagine Dragons - Demons",
        artist= "Imagine Dragons",
        album= "Imagine Dragons",
        url= "https://colega-20.github.io/proyec/Musica/Imagine%20dragons-Demons%20X%20spiderman%20MV.mp3",
        image= "https://cdn.leonardo.ai/users/c29776b1-80e9-49cf-98bc-bd95339b5d7a/generations/cec38046-0f97-4122-83f3-aa50802df242/Default_Imagine_dragons_1.jpg",
    ),
    Song(
        title= "Imagine Dragons - Radioactive",
        artist= "Imagine Dragons",
        album= "Imagine Dragons",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FImagine%20Dragons%20-%20Radioactive.mp3?alt=media&token=3ba663b1-22c2-4a81-9de7-9d78dd3bda5f",
        image= "https://i1.sndcdn.com/artworks-LmFTWpeppV0rsEb9-EHuVEA-t500x500.jpg",
    ),
    Song(
        title= "Imagine Dragons - Natural",
        artist= "Imagine Dragons",
        album= "Imagine Dragons",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FImagine%20Dragons%20-%20Natural%20(Lyrics).mp3?alt=media&token=cbc59b68-a047-4acd-827c-ce01d00dd400",
        image= "https://zamaninotesi.com/wp-content/uploads/2014/07/ruh_ikizi_nedir.jpg",
    ),
    Song(
        title= "Imagine Dragons - I’m So Sorry",
        artist= "Imagine Dragons",
        album= "Imagine Dragons",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FI%E2%80%99m%20So%20Sorry.mp3?alt=media&token=4cd6049a-cbcb-41c1-aff8-4f0279d3ba11",
        image= "https://i1.sndcdn.com/artworks-uX9v2DpOBaAJ6uUy-7Zk1kQ-t500x500.jpg",
    ),
    Song(
        title= "Akon - lonely {slowed reverb}",
        artist= "cup of coffee",
        album= "Lofi",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Akon%20-%20Lonely%20%7BBASS%20BOOSTED%7D.mp3",
        image= "https://i.pinimg.com/736x/00/e7/2f/00e72f80b3a593f1fd4da26ad564c585.jpg",
    ),
    Song(
        title= "Oceans (Shalom Margaret Cover) - Lofi Remix",
        artist= "Shalommargaret",
        album= "Lofi",
        url= "https://colega-20.github.io/proyec/Musica/Oceans%20(Shalom%20Margaret%20Cover)%20-%20Lofi%20Remix.mp3?alt=media",
        image= "https://ideogram.ai/assets/progressive-image/balanced/response/UNxlsUOdQ32hwvKi6M5wfQ",
    ),
    Song(
        title= "Dido - Thank You (slowed) [Thunderstorm Remix]",
        artist= "Nedviel - Topic",
        album= "Lofi",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FDido%20-%20Thank%20You%20(%20s%20l%20o%20w%20e%20d%20)%20%5BThunderstorm%20Remix%5D.mp3?alt=media&token=8275d864-5432-4778-b153-37c8ad320b45",
        image=
            "https://images.steamusercontent.com/ugc/2299713239861867527/1BC5BFCBFBD15F72ECCD75DB0700F54647ACA6D4/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    ),
    Song(
        title= "Eminem - Mockingbird (Lofi Cover)",
        artist= "Joongle",
        album= "Lofi",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FEminem%20-%20Mockingbird%20(Lofi%20Cover).mp3?alt=media&token=1db5812f-3469-441c-bfd2-0b97ec39c317",
        image= "https://i.pinimg.com/736x/fe/5e/e7/fe5ee7188206c6b2dd1b14794b2d9860.jpg",
    ),
    Song(
        title= "Something in the Way Remix (Relax Version)",
        artist= "The Wizard",
        album= "Lofi",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/THE%20BATMAN%20-%20Something%20in%20the%20Way%20Remix%20%28Relax%20Version%29.mp3",
        image= "https://i.pinimg.com/736x/1c/a4/78/1ca478f23f82cd75abe4969250d173f2.jpg",
    ),
    Song(
        title= "lost sky dreams pt. ll",
        artist= "sara skinnere, lost sky",
        album= "Musica de fondo 3",
        url= "https://colega-20.github.io/proyec/Musica/lost%20sky%20dreams%20pt%20ii%20feat%20sara%20skinner%20ncs%20release.mp3",
        image=
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9fae44eb-4272-41d8-973f-589cfe60822d/dgq2g5v-9af434a8-187e-4dfb-8a61-8702cfe652e1.jpg/v1/fill/w_894,h_894,q_70,strp/it_stirs_by_digitaldori_dgq2g5v-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzlmYWU0NGViLTQyNzItNDFkOC05NzNmLTU4OWNmZTYwODIyZFwvZGdxMmc1di05YWY0MzRhOC0xODdlLTRkZmItOGE2MS04NzAyY2ZlNjUyZTEuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.KzYDsE5FjSBrfMswiQ6hQ4U-jTE6up4WG5OLD-X5LgE",
    ),
    Song(
        title= "the last of last 2",
        artist= "the last of last 2",
        album= "Musica de fondo 3",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FMusic.mp3?alt=media&token=91e1f89c-965e-4c81-a132-e386091bcdb8",
        image= "https://i.pinimg.com/736x/42/1a/d2/421ad2ccbc54d7e329241ecaccd6082a.jpg",
    ),
    Song(
        title= "Chris Haugen - Western Spaghetti",
        artist= "Chris Haugen",
        album= "Musica de fondo 3",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2FChris%20Haugen%20-%20Western%20Spaghetti.mp3?alt=media&token=14d402b7-b7c1-4197-a89c-ce31aaddb127",
        image= "https://i.pinimg.com/736x/36/db/6c/36db6cad5d391fb538fc1dd844819338.jpg",
    ),
    Song(
        title= "Marshall Furst - Marshall Motors",
        artist= "Marshall Furst",
        album= "Musica de fondo 3",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2F01.%20Marshall%20Motors%20-%20Need%20For%20Speed%20Movie%20Soundtrack%20-%20TeddyCow.mp3?alt=media",
        image= "https://i.pinimg.com/736x/83/31/2c/83312cd5d8fdf2428a2638374939bb80.jpg",
    ),
    Song(
        title= "Boone - cold nights",
        artist= "Boone",
        album= "Musica de fondo 3",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2Fboone%20-%20cold%20nights.mp3?alt=media&token=705375ea-5acf-48fd-9d62-528434952ea7",
        image= "https://i.pinimg.com/736x/5d/e6/59/5de65938883f7e97d6be3e94e765e1c7.jpg",
    ),
    Song(
        title= "øneheart x reidenshi - snowfall",
        artist= "dreamscape",
        album= "Musica de fondo 3",
        url= "https://colega-20.github.io/proyec/Musica/%C3%B8neheart%20x%20reidenshi%20-%20snowfall.mp3",
        image=
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0385a60d-a285-43ac-9e23-c67a6d3a7b62/dfalhgn-a7c2e45e-c405-4fbd-851e-23d09fbf4863.png/v1/fill/w_894,h_894,q_70,strp/sleep_runner___voxel_by_abductedbypixel_dfalhgn-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA4MCIsInBhdGgiOiJcL2ZcLzAzODVhNjBkLWEyODUtNDNhYy05ZTIzLWM2N2E2ZDNhN2I2MlwvZGZhbGhnbi1hN2MyZTQ1ZS1jNDA1LTRmYmQtODUxZS0yM2QwOWZiZjQ4NjMucG5nIiwid2lkdGgiOiI8PTEwODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.ZHNKv5fYO_z8RghsvNUmm6WyicRTiN1Z9k-V0qlGZj8",
    ),
    Song(
        title= "A moment we will never see (slowed + reverb)",
        artist= "Rōōh= Tema",
        album= "Musica de fondo 3",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2Fa%20moment%20we%20will%20never%20see%20(slowed%20%2B%20reverb).mp3?alt=media&token=c828b0ae-923e-41ee-bec4-43726b653828",
        image= "https://i.pinimg.com/736x/98/9f/11/989f11282b16105fef9f9b6b78635b60.jpg",
    ),
    Song(
        title= "幻昼（钢琴版",
        artist= "幻昼（钢琴版",
        album= "Musica de fondo 3",
        url= "https://firebasestorage.googleapis.com/v0/b/hola-7d6f2.appspot.com/o/colega%2F%E5%B9%BB%E6%98%BC%EF%BC%88%E9%92%A2%E7%90%B4%E7%89%88%EF%BC%89.mp3?alt=media&token=5492a28f-0967-4510-ac64-db51fcca5322",
        image= "https://i.scdn.co/image/ab67616d00001e029140b7b186f87f9f53c26379",
    ),
    Song(
        title= "Ludovico Einaudi - Experience",
        artist= "Ludovico Einaudi",
        album= "Musica de fondo 3",
        url= "https://pwnr48mahdsme2vm.public.blob.vercel-storage.com/mp3/Ludovico%20Einaudi%20-%20Experience.mp3",
        image= "https://i.pinimg.com/736x/3f/a1/80/3fa180513080b7c020120e6c3c003376.jpg",
    ),
)

// --- ARCHIVO: PlaylistData.kt ---

// 1. Array de selección manual para la SESIÓN 2
// Aquí tú escribes el nombre exacto del álbum que quieres destacar
val featuredAlbumNames = listOf("Imagine Dragons")

// 2. Agrupación base de álbumes
val allAlbums = globalPlaylist.groupBy { it.album }
    .map { (name, songsList) ->
        Album(
            name = name,
            artist = songsList.first().artist,
            cover = songsList.first().image,
            songs = songsList
        )
    }

// 3. SESIÓN 2: Solo los que elegiste en el array de arriba
val session2Albums = allAlbums.filter { it.name in featuredAlbumNames }
