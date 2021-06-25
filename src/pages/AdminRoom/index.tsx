import { useHistory, useParams } from 'react-router-dom'
import { FiTrash, FiCheckCircle, FiMessageSquare } from 'react-icons/fi'

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

  async function handleQuestionAnswered(questionId: string) {
    const roomRef = await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .get()

    if (roomRef.val().isAnswered) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: false,
      })

      return
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      })

      return
    }
  }

  async function handleQuestionHighlight(questionId: string) {
    const roomRef = await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .get()

    if (roomRef.val().isHighlighted) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false,
      })

      return
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      })

      return
    }
  }

  async function handleQuestionDelete(questionId: string) {
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
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  <button
                    type="button"
                    title="Marcar como respondida"
                    onClick={() => handleQuestionAnswered(question.id)}
                  >
                    <FiCheckCircle
                      color={question.isAnswered ? '#835afd' : '#737380'}
                      size={20}
                    />
                  </button>

                  <button
                    type="button"
                    title="Destacar pergunta"
                    onClick={() => handleQuestionHighlight(question.id)}
                  >
                    <FiMessageSquare
                      color={question.isHighlighted ? '#835afd' : '#737380'}
                      size={20}
                    />
                  </button>

                  <button
                    type="button"
                    title="Excluir pergunta"
                    onClick={() => handleQuestionDelete(question.id)}
                  >
                    <FiTrash color="#737380" size={20} />
                  </button>
                </Question>
              )
            })}
        </div>
      </main>
    </div>
  )
}
