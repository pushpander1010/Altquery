'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 text-slate-600" />
              )}
              {isLast ? (
                <span className="text-slate-300 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-indigo-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
