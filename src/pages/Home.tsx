import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { database } from 'services/firebase'
import { useAuth } from 'hooks/useAuth'
import { Button } from 'components/Button'

import illustrationImg from 'assets/images/illustration.svg'
import logoImg from 'assets/images/logo.svg'
import { GrGoogle, GrGithub } from 'react-icons/gr'

import 'styles/auth.scss'

export function Home() {
  const { user, signInWithGoogle, signInWithGitHub } = useAuth()
  const history = useHistory()
  const [roomCode, setRoomCode] = useState('')

  async function handleGoogle() {
    if (!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new')
  }

  async function handleGitHub() {
    if (!user) {
      await signInWithGitHub()
    }

    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if (!roomRef.exists()) {
      alert('Room does not exists.')
      return
    }

    if (roomRef.val().closedAt) {
      alert('Room already closed.')
      setRoomCode('')
      return
    }

    history.push(`rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Perguntas e Respostas" />
        <strong>Crie salas de Q&A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="LetMeAsk" />

          <button className="create-room" onClick={handleGoogle}>
            <GrGoogle size={24} />
            Crie sua sala com o Google
          </button>

          <button className="create-room github" onClick={handleGitHub}>
            <GrGithub size={24} />
            Crie sua sala com o GitHub
          </button>

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
