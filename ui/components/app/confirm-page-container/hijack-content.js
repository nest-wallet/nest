import React, { useState, useEffect } from 'react'
import Button from '../../ui/button';



export default function HijackContent({setHijacking}) {
  const [funding, setFunding] = useState(true)
  const [using, setUsing] = useState(false)
  const [removing, setRemoving] = useState (false)
  let step = 'Funding'

  if (using) {
    step = 'Using'
  }

  if (removing) { 
    step = 'Removing'
  }

  useEffect(() => {
    console.log('hijack content loaded')
  }, [])

  return (
    <div className="confirm-page-container-content__details hijack-content">
      <div className="content">
        <h1>{step} Condom</h1>
        <h1>..............</h1>
      </div>
      {/* <Button type="default" onClick={() => setHijacking(false)}>
        Make the orginal tx
      </Button> */}
    </div>
  )
}