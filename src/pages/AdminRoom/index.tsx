import { useHistory, useParams } from 'react-router-dom'
import { FiTrash } from 'react-icons/fi'

import { database } from 'services/firebase'
import { useRoom } from 'hooks/useRoom'
import { Button } from 'components/Button'
import { RoomCode } from 'components/RoomCode'
import { Question } from 'components/Question'

import logoImg from 'assets/images/logo.svg'

import 'styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id

  const { questions, title } = useRoom(roomId)

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="LetMeAsk" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title || 'Loading'}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <div className="question-list">
          {questions &&
            questions.map((question) => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <FiTrash
                      color={question.likeId ? '#835afd' : '#737380'}
                      size={20}
                    />
                  </button>
                </Question>
              )
            })}
        </div>
      </main>
    </div>
  )
}
