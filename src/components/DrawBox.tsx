import React, { useState } from 'react'

const initialBoxState = {
  isBoxSelecting: false,
  boxLeft: 0,
  boxTop: 0,
  boxWidth: 0,
  boxHeight: 0,
  initialW: 0,
  initialH: 0,
}

const DrawBox = ({ boxRef, style }) => {
  const [rec, setRec] = useState({ x: 0, y: 0 })
  const [boxState, setBoxState] = useState(initialBoxState)

  const getInitialCoordinates = () => {
    const style = window.getComputedStyle(document.body)
    const t = style.getPropertyValue('margin-top')
    const l = style.getPropertyValue('margin-left')
    const mLeft = parseInt(l.slice(0, l.length - 2), 10)
    const mTop = parseInt(t.slice(0, t.length - 2), 10)

    const bodyRect = document.body.getBoundingClientRect()
    const elemRect = boxRef.current.getBoundingClientRect()

    return {
      x: Math.round(elemRect.left - bodyRect.left + mLeft),
      y: Math.round(elemRect.top - bodyRect.top + mTop),
    }
  }

  const onMouseDown = e => {
    setRec(getInitialCoordinates())
    const rect = getInitialCoordinates()
    setBoxState({
      ...boxState,
      isBoxSelecting: true,
      boxLeft: e.pageX - rect.x,
      boxTop: e.pageY - rect.y,
      initialW: e.pageX - rect.x,
      initialH: e.pageY - rect.y,
    })
  }

  const onMouseUp = () => {
    setBoxState(initialBoxState)
  }
  const onMouseMove = e => {
    if (!boxState.isBoxSelecting) return
    setBoxState({
      ...boxState,
      boxWidth: Math.abs(boxState.initialW - e.pageX + rec.x),
      boxHeight: Math.abs(boxState.initialH - e.pageY + rec.y),
      boxLeft: Math.min(e.pageX - rec.x, boxState.initialW),
      boxTop: Math.min(e.pageY - rec.y, boxState.initialH),
    })
  }

  const boxStyle = {
    left: boxState.boxLeft,
    top: boxState.boxTop,
    width: boxState.boxWidth,
    height: boxState.boxHeight,
  }

  return (
    <div
      className="boxWrapper"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      style={style}
    >
      <div className="box" style={boxStyle} ref={boxRef}>
        {boxState.isBoxSelecting && <span className="span" />}
      </div>
    </div>
  )
}

export default DrawBox
