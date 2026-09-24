import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--atria-base)] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-[var(--atria-primary)]/10 text-[var(--atria-primary)]">
          <FileQuestion className="size-10" strokeWidth={1.5} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--atria-accent)]">
          Erro 404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--atria-primary)]">
          Página não encontrada
        </h1>
        <p className="mt-3 text-sm text-[var(--atria-primary)]/55">
          O recurso que você tentou acessar não existe, foi movido ou você não
          tem permissão para visualizá-lo.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            render={<Link href="/dashboard" />}
            className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
          >
            <Home className="size-4" />
            Ir ao Dashboard
          </Button>
          <Button
            variant="outline"
            render={<Link href="/" />}
            className="border-[var(--atria-primary)]/20 text-[var(--atria-primary)]"
          >
            <ArrowLeft className="size-4" />
            Voltar ao início
          </Button>
        </div>
      </div>

      <p className="mt-12 text-xs text-[var(--atria-primary)]/35">
        ATRIA ERP · Sistema de gestão
      </p>
    </div>
  );
}
