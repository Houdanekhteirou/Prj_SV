'use client'
import ReactPlayer from 'react-player'

type Props = {
  url: string
}

function VideoPlayer({ url }: Props) {
  const playerStyle: React.CSSProperties = {
    borderWidth: 2,
    borderColor: '#00a95c'
  }

  return (
    <div>
      <ReactPlayer url={url} controls={false} light style={playerStyle} />
    </div>
  )
}

export default VideoPlayer
