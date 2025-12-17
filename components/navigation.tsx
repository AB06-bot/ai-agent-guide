"use client"

import Link from "next/link"
import { useState } from "react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-neutral-200/60 supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-black hover:text-neutral-600 transition-colors">
              AI-Agent Guide
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/agents" className="text-sm font-medium text-black hover:text-neutral-600 transition-colors">
                Agents
              </Link>
              <Link href="/policy" className="text-sm font-medium text-black hover:text-neutral-600 transition-colors">
                Policy
              </Link>
              <Link href="/safety" className="text-sm font-medium text-black hover:text-neutral-600 transition-colors">
                Safety
              </Link>
              <Link
                href="/industries"
                className="text-sm font-medium text-black hover:text-neutral-600 transition-colors"
              >
                Industries
              </Link>
              <Link
                href="/infrastructure"
                className="text-sm font-medium text-black hover:text-neutral-600 transition-colors"
              >
                Infrastructure
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-black transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-6 h-0.5 bg-black transition-opacity ${isOpen ? "opacity-0" : ""}`} />
              <span
                className={`w-6 h-0.5 bg-black transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div
            className="absolute right-0 top-0 h-full w-64 bg-white border-l border-neutral-300 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-6 p-6 pt-20">
              <Link
                href="/agents"
                className="text-base font-medium text-black hover:text-neutral-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Agents
              </Link>
              <Link
                href="/policy"
                className="text-base font-medium text-black hover:text-neutral-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Policy
              </Link>
              <Link
                href="/safety"
                className="text-base font-medium text-black hover:text-neutral-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Safety
              </Link>
              <Link
                href="/industries"
                className="text-base font-medium text-black hover:text-neutral-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Industries
              </Link>
              <Link
                href="/infrastructure"
                className="text-base font-medium text-black hover:text-neutral-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Infrastructure
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
