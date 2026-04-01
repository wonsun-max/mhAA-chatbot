"use client"

import { useEffect } from "react"

/**
 * AntigravityEffect component for April Fools' Day.
 * Tracks mouse movement and updates CSS variables to create a "floating" parallax effect.
 * @returns null
 */
export default function AntigravityEffect() {
  useEffect(() => {
    const now = new Date()
    const isAprilFools = now.getMonth() === 3 && now.getDate() === 1

    if (!isAprilFools) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2 // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2 // -1 to 1
      
      document.documentElement.style.setProperty("--mouse-x", x.toString())
      document.documentElement.style.setProperty("--mouse-y", y.toString())
    }

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      
      // Map tilt to -1 to 1 range
      const x = Math.max(-1, Math.min(1, e.gamma / 45))
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 45))
      
      document.documentElement.style.setProperty("--mouse-x", x.toString())
      document.documentElement.style.setProperty("--mouse-y", y.toString())
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("deviceorientation", handleDeviceOrientation)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleDeviceOrientation)
    }
  }, [])

  return null
}
