"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, Package, Clock, CheckCircle2, XCircle, ArrowLeft, ExternalLink } from "lucide-react"

interface Order {
  id: string
  created_at: string
  status: string
  total: number
  items: { name: string; quantity: number; price: number }[]
  delivery?: string
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  paid: {
    label: "Pago",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  pending: {
    label: "Pendente",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  delivered: {
    label: "Entregue",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    icon: <Package className="h-3.5 w-3.5" />,
  },
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar sessão
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login")
          return
        }
        setUser(data.user)
        // Buscar pedidos
        return fetch("/api/orders")
      })
      .then((r) => r?.json())
      .then((data) => {
        setOrders(data?.orders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const formatPrice = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header da página */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-white text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-red-500" />
              Meus Pedidos
            </h1>
            {user && (
              <p className="text-zinc-500 text-sm mt-0.5">{user.email}</p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-zinc-500 text-sm">Carregando seus pedidos...</p>
          </div>
        )}

        {/* Sem pedidos */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Package className="h-10 w-10 text-zinc-600" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">Nenhum pedido encontrado</p>
              <p className="text-zinc-500 text-sm mt-1">Seus pedidos aparecerão aqui após a compra.</p>
            </div>
            <Link
              href="/produtos"
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition-all"
            >
              Ver Produtos
            </Link>
          </div>
        )}

        {/* Lista de pedidos */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.pending
              return (
                <div
                  key={order.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Cabeçalho do pedido */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div>
                      <p className="text-white text-sm font-semibold">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  {/* Itens */}
                  <div className="px-5 py-4 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 flex-shrink-0" />
                          <span className="text-zinc-300 text-sm">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        <span className="text-zinc-400 text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Entrega / chave do produto */}
                  {order.delivery && (
                    <div
                      className="mx-5 mb-4 px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(220,38,38,0.06)",
                        border: "1px solid rgba(220,38,38,0.2)",
                      }}
                    >
                      <p className="text-zinc-500 text-xs mb-1">Produto entregue</p>
                      <p className="text-white text-sm font-mono break-all">{order.delivery}</p>
                    </div>
                  )}

                  {/* Rodapé */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                    <span className="text-zinc-500 text-sm">Total</span>
                    <span className="text-white font-bold">{formatPrice(order.total)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
