/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Stage, Container, Sprite, useTick, Text } from '@pixi/react'
import * as PIXI from 'pixi.js'
import { sound } from '@pixi/sound'
import { ContentProperties } from './ContentProperties'

class SessionInfo {
  name: string
  age: number
  setAge: any
  fromPos: [number, number]
  toPos: [number, number]
  fromMillis: number
  moveMillis: number
  style: PIXI.TextStyle

  constructor(
    name: string,
    age: [number, any],
    fromPos: [number, number],
    toPos: [number, number],
    fromMillis: number,
    moveMillis: number,
    style: PIXI.TextStyle
  ) {
    this.name = name
    this.age = age[0]
    this.setAge = age[1]
    this.fromPos = fromPos
    this.toPos = toPos
    this.fromMillis = fromMillis
    this.moveMillis = moveMillis
    this.style = style
  }

  isActive(currentMillis: number): boolean {
    return currentMillis > this.fromMillis
  }

  x(): number {
    // Bezier
    const t = Math.min(this.age, this.moveMillis) / this.moveMillis
    const b = t * t * (3.0 - 2.0 * t)
    const d = (this.toPos[0] - this.fromPos[0]) * b
    return this.age < this.moveMillis ? this.fromPos[0] + d : this.toPos[0]
  }

  y(): number {
    return this.fromPos[1]
  }
}

const RotatingBunny: React.FC<ContentProperties> = (
  props: ContentProperties
) => {
  const duration = 15 // 単位: 秒 これが animation パートの長さ TODO: 実際に必要な長さにする

  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const [count, setCount] = useState(duration)
  const [rotation, setRotation] = useState(0)
  const [title, setTitle] = useState(props.talkData?.title || 'title')
  const [speaker, setSpeaker] = useState(
    props.speakersData ? props.speakersData[0].name : 'speaker'
  )
  const [company, setCompany] = useState(
    props.speakersData ? props.speakersData[0].company : 'company'
  )
  const [session_time, setSession_time] = useState(
    props.talkData?.startTime || 'session_time'
  )

  useEffect(() => {
    if (
      props.talkData &&
      props.talkData.speakers &&
      props.talkData.speakers.length > 0 &&
      props.speakersData
    ) {
      const speakersMap = new Map(
        props.speakersData.map((speaker) => [speaker.id, speaker])
      )
      // 今の API なら、複数登壇者は文字列結合されているので、最初の登壇者のみを表示する
      const SpeakersId = props.talkData.speakers[0]
      const Speakers = speakersMap.get(SpeakersId.id)
      if (Speakers) {
        setSpeaker(Speakers.name)
        setCompany(Speakers.company)
      }
    }
  }, [props.talkData, props.speakersData])

  if (!sound.exists('bgm'))
    sound.add('bgm', '/cndw2024/cndw2024_intermission.mp3')

  const style_clock = new PIXI.TextStyle({
    align: 'center',
    fontFamily: 'video-cond',
    fontSize: 88,
    fontWeight: '600',
    fill: ['#ffffff'],
    stroke: '#ffffff',
    strokeThickness: 1,
    letterSpacing: 5,
    wordWrap: true,
    wordWrapWidth: 650,
  })

  const style_info = new PIXI.TextStyle({
    align: 'left',
    fontFamily:
      '"Verdana", "游ゴシック", "YuGothic", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "メイリオ", "Meiryo", sans-serif',
    fontSize: 30,
    fontWeight: '600',
    fill: ['#404040'],
    stroke: '#404040',
    strokeThickness: 1,
    letterSpacing: 1,
    wordWrap: true,
    wordWrapWidth: 900,
  })

  const style_label = new PIXI.TextStyle({
    align: 'center',
    fontFamily:
      '"Verdana", "游ゴシック", "YuGothic", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "メイリオ", "Meiryo", sans-serif',
    fontSize: 30,
    fontWeight: '300',
    fill: ['#404040'],
    stroke: '#404040',
    strokeThickness: 1,
    letterSpacing: 4,
    wordWrap: true,
    wordWrapWidth: 900,
  })

  const sessions: SessionInfo[] = new Array()
  sessions.push(
    new SessionInfo(
      time,
      useState(0.0),
      [755, 100],
      [755, 100],
      0,
      0,
      style_clock
    )
  )
  sessions.push(
    new SessionInfo(
      session_time,
      useState(0.0),
      [555, 250],
      [555, 250],
      0,
      0,
      style_label
    )
  )
  sessions.push(
    new SessionInfo(
      title,
      useState(0.0),
      [255, 300],
      [255, 300],
      0,
      0,
      style_info
    )
  )
  sessions.push(
    new SessionInfo(
      speaker,
      useState(0.0),
      [255, 500],
      [255, 500],
      0,
      0,
      style_info
    )
  )
  sessions.push(
    new SessionInfo(
      company,
      useState(0.0),
      [255, 560],
      [255, 560],
      0,
      0,
      style_info
    )
  )

  // 左右スライドインサンプル
  // sessions.push(new SessionInfo('間もなく', useState(0.0), [300, -200], [-120, -200], 3000, 300))
  // sessions.push(new SessionInfo('CM', useState(0.0), [-300, -50], [90, -50], 4000, 300))
  // sessions.push(new SessionInfo('入ります', useState(0.0), [300, 80], [-200, 80], 5000, 300))

  // Load 時に bgm を開始
  useEffect(() => {
    console.log('once...')
    sound.volume('bgm', 0.5)
    sound.play('bgm')
  }, [])

  // 1秒ごとの処理
  useEffect(() => {
    if (count <= 0) {
      sound.stop('bgm')
      props.onEnded()
    } else {
      if (count <= 5) {
      }

      setTimeout(() => {
        setCount(count - 1)
      }, 1000)
    }
  }, [count])

  // PIXI フレーム更新時の処理
  useTick((delta) => {
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i]
      if (!session.isActive((10 - count) * 1000)) {
        continue
      }
      session.setAge(session.age + delta * (1000 / 60))
    }

    // 現在時刻を更新
    setTime(new Date().toLocaleTimeString())

    // 開始直後、終了間際は静止
    if ((rotation * (180 / Math.PI)) % 360 <= 10 && count <= 1) {
      setRotation(0)
    } else {
      delta && count < 9 && setRotation(rotation + 0.1 * delta)
    }

    // bgm フェードアウト
    const volume = sound.volume('bgm')
    if (count <= 5 && volume > 0) {
      sound.volume('bgm', Math.max(volume - 0.002, 0))
    }
  })

  return (
    <>
      <Sprite
        image="https://res.cloudinary.com/lesto-dertne/image/upload/v1697829207/EMTEC-intermission/background.png"
        anchor={0}
        x={0}
        y={0}
        scale={1}
        // rotation={rotation}
      />

      {/* <Text
        text={count.toString()}
        x={200}
        y={150}
        style={style}
      /> */}
      {sessions
        .filter((x) => x.isActive((duration - count) * 1000))
        .map((x, i) => {
          return (
            <Text key={i} text={x.name} x={x.x()} y={x.y()} style={x.style} />
          )
        })}
    </>
  )
}

const PixiApp: React.FC<ContentProperties> = (props: ContentProperties) => {
  return (
    <Stage width={1920} height={1080}>
      <Container position={[0, 0]}>
        <RotatingBunny
          onEnded={props.onEnded}
          talkData={props.talkData}
          speakersData={props.speakersData}
        />
      </Container>
    </Stage>
  )
}

export default PixiApp
