import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

type CardProps = {
  to: string
  title: string
  description: string
  Icon: LucideIcon
}

export default function Card({ to, title, description, Icon }: CardProps) {
  return (
    <>
      <Link
        to={to}
        className="group block rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm translate-y-1 hover:scale-[1.02] hover:border-amber-400/40 hover:shadow-[0_0_40px_-10px_rgba(251, 191, 36, 0.45)]"
      >
        <Icon className="mb-4 size-7 text-amber-400 transition duration-300 group-hover:-translate-y-1 group-hover:-rotate-6" />
        <h3 className="text-lg font-semi-bold">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </Link>
    </>
  )
}
