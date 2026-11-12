import type { ReactNode } from "react"

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <header className="max-w-2xl">
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h1 className="type-h2 mt-2 text-balance">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  )
}
