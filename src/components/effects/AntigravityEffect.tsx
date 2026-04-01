"use client"

import { useEffect, useState } from "react"
import FakeErrorOverlay from "./FakeErrorOverlay"

/**
 * AntigravityEffect component for April Fools' Day.
 * Tracks mouse movement and updates CSS variables to create a "floating" parallax effect.
 * Also triggers a "Critical System Error" prank after a short delay.
 * 
 * @returns {JSX.Element | null}
 */
export default function AntigravityEffect() {
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const now = new Date()
    const isAprilFools = now.getMonth() === 3 && now.getDate() === 1

    if (!isAprilFools) return

    // 1. Antigravity Mouse/Tilt Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      document.documentElement.style.setProperty("--mouse-x", x.toString())
      document.documentElement.style.setProperty("--mouse-y", y.toString())
    }

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      const x = Math.max(-1, Math.min(1, e.gamma / 45))
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 45))
      document.documentElement.style.setProperty("--mouse-x", x.toString())
      document.documentElement.style.setProperty("--mouse-y", y.toString())
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("deviceorientation", handleDeviceOrientation)

    // 2. Fake Error Prank Logic
    // We only prank the user once per session to not be overly annoying.
    const hasBeenPranked = sessionStorage.getItem("april-fools-pranked")
    
    let timer: NodeJS.Timeout | null = null
    if (!hasBeenPranked) {
      // Trigger after 20-40 seconds of interaction
      timer = setTimeout(() => {
        setShowError(true)
      }, 20000 + Math.random() * 20000)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleDeviceOrientation)
      if (timer) clearTimeout(timer)
    }
  }, [])

  if (showError) {
    return (
      <FakeErrorOverlay 
        onDismiss={() => {
          setShowError(false)
          sessionStorage.setItem("april-fools-pranked", "true")
        }} 
      />
    )
  }

  return null
}
