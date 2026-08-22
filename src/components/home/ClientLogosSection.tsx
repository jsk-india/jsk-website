import Link from 'next/link'
import Image from 'next/image'
import type { Client, HomeContent } from '@/payload-types'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { HOME_DEFAULTS, clientLogoFallback, textOr } from '@/lib/content-defaults'

interface Props {
  clients: Client[]
  headings: HomeContent['sectionHeadings']
  prefix: string
}

export function ClientLogosSection({ clients, headings, prefix }: Props) {
  if (clients.length === 0) return null
  const h = headings ?? {}
  const d = HOME_DEFAULTS.sectionHeadings

  return (
    <section className="border-y border-surface-100 bg-surface-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-ink-600">
          {textOr(h.clientsHeading, d.clientsHeading)}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {clients.map((c) => (
            <ClientLogo key={c.id} client={c} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href={`${prefix}/clients`} className="text-sm font-semibold text-brand-red hover:underline">
            {textOr(h.viewAllClientsLink, d.viewAllClientsLink)}
          </Link>
        </div>
      </div>
    </section>
  )
}

function ClientLogo({ client }: { client: Client }) {
  const logo = mediaUrl(client.logo, 'card') ?? mediaUrl(client.logo) ?? clientLogoFallback(client.name)

  return (
    <div className="flex h-16 items-center rounded bg-white px-4 shadow-sm">
      {logo ? (
        <Image
          src={logo}
          alt={mediaAlt(client.logo) || client.name}
          width={120}
          height={48}
          className="h-8 w-auto object-contain grayscale transition hover:grayscale-0"
          title={client.name}
        />
      ) : (
        <span className="text-xs font-medium text-ink-600">{client.name}</span>
      )}
    </div>
  )
}
