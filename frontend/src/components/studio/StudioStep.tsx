import { createContext, useContext, type ReactNode, type Ref } from "react"

const HeadingLevel = createContext<"h1" | "h2">("h1")

export function StudioHeadingLevel({ level, children }: { level: "h1" | "h2"; children: ReactNode }) {
  return <HeadingLevel.Provider value={level}>{children}</HeadingLevel.Provider>
}

export function StudioStep({
  title,
  description,
  titleId,
  headingRef,
  children,
}: {
  title: string
  description: string
  titleId: string
  headingRef?: Ref<HTMLHeadingElement>
  children: ReactNode
}) {
  const level = useContext(HeadingLevel)
  const className = "scroll-mt-24 text-2xl font-semibold tracking-tight text-balance outline-none"
  return (
    <div>
      {level === "h2" ? (
        <h2 id={titleId} ref={headingRef} tabIndex={-1} className={className}>
          {title}
        </h2>
      ) : (
        <h1 id={titleId} ref={headingRef} tabIndex={-1} className={className}>
          {title}
        </h1>
      )}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  )
}
