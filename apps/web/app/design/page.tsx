'use client'
import { Logo } from '../../components/brand/Logo'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Field } from '../../components/ui/Input'
import { Badge, PlanBadge } from '../../components/ui/Badge'
import { Icon, type IconKey } from '../../components/ui/icons'
import { brand } from '../../lib/brand'

const swatches: { name: string; value: string }[] = [
  { name: 'Paper', value: brand.paper },
  { name: 'Ink', value: brand.ink },
  { name: 'Blue', value: brand.blue },
  { name: 'Blue Deep', value: brand.blueDeep },
  { name: 'Sky', value: brand.blueSky },
  { name: 'Navy', value: brand.navy },
  { name: 'Success', value: brand.success },
  { name: 'Warning', value: brand.warning },
  { name: 'Danger', value: brand.danger },
  { name: 'Border', value: brand.border },
]

const iconKeys: IconKey[] = ['grid', 'folder', 'chart', 'trend', 'gear', 'users', 'card', 'bell', 'upload', 'download', 'share', 'search', 'file', 'image', 'video', 'flag', 'shield', 'database', 'check', 'plus']

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-display font-extrabold text-[#141110] text-lg tracking-tight mb-4 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-[#1A56DB]" />
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <Logo size={40} />
          <h1 className="font-display font-extrabold text-[#141110] text-3xl tracking-tight mt-6 mb-2">Design System</h1>
          <p className="text-[#6B6560] text-sm max-w-lg">
            Sistem desain Cloudtify — &ldquo;Warm Precision&rdquo;. Satu aksen biru, palet kertas hangat,
            tipografi tegas. Komponen di halaman ini dipakai di seluruh produk &amp; admin.
          </p>
        </header>

        <Block title="Logo">
          <Card className="p-8 flex flex-wrap items-center gap-10">
            <Logo size={40} />
            <Logo variant="tile" size={48} />
            <Logo variant="mark" size={40} />
            <div className="rounded-2xl px-6 py-5" style={{ background: '#0B1C4D' }}><Logo wordmark="light" size={32} /></div>
          </Card>
        </Block>

        <Block title="Warna">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {swatches.map((s) => (
              <Card key={s.name} className="overflow-hidden">
                <div className="h-16" style={{ background: s.value, borderBottom: '1px solid #E5E2DD' }} />
                <div className="px-3 py-2">
                  <p className="text-[#141110] text-xs font-semibold">{s.name}</p>
                  <p className="text-[#A8A29E] text-[10px] font-mono uppercase">{s.value}</p>
                </div>
              </Card>
            ))}
          </div>
        </Block>

        <Block title="Tipografi">
          <Card className="p-8 space-y-3">
            <p className="font-display font-extrabold text-[#141110] text-4xl tracking-tight">Plus Jakarta Sans</p>
            <p className="font-display font-bold text-[#141110] text-2xl">Heading display, tegas &amp; modern</p>
            <p className="text-[#3D3A37] text-base">Inter — teks isi, mudah dibaca pada layar kecil maupun besar.</p>
            <p className="text-[#A8A29E] text-sm">Muted — keterangan sekunder &amp; metadata.</p>
          </Card>
        </Block>

        <Block title="Tombol">
          <Card className="p-8 flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </Card>
        </Block>

        <Block title="Badge">
          <Card className="p-8 flex flex-wrap items-center gap-2.5">
            <Badge>Neutral</Badge>
            <Badge tone="blue">Blue</Badge>
            <Badge tone="green">Aktif</Badge>
            <Badge tone="amber">Pending</Badge>
            <Badge tone="red">Diblokir</Badge>
            <span className="w-px h-5 bg-[#E5E2DD]" />
            <PlanBadge plan="free" />
            <PlanBadge plan="plus" />
            <PlanBadge plan="pro" />
            <PlanBadge plan="ultra" />
          </Card>
        </Block>

        <Block title="Input">
          <Card className="p-8 max-w-sm space-y-4">
            <Field label="Email" icon={<Icon.file size={16} />} placeholder="nama@email.com" />
            <Field label="Password" type="password" icon={<Icon.shield size={16} />} placeholder="••••••••" />
          </Card>
        </Block>

        <Block title="Ikon">
          <Card className="p-8 grid grid-cols-6 sm:grid-cols-10 gap-4 text-[#3D3A37]">
            {iconKeys.map((k) => {
              const I = Icon[k]
              return (
                <div key={k} className="flex flex-col items-center gap-1.5">
                  <I size={20} />
                  <span className="text-[9px] text-[#A8A29E]">{k}</span>
                </div>
              )
            })}
          </Card>
        </Block>
      </div>
    </div>
  )
}
