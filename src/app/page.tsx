export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-(family-name:--font-geist-sans)">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl font-extrabold tracking-tight">TRIQ</h1>
        <p className="text-lg text-muted-foreground">
          Платформа для розвитку когнітивних навичок
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-primary text-primary-foreground gap-2 hover:bg-primary-hover h-10 sm:h-12 px-4 sm:px-5 text-sm sm:text-base">
            Почати тренування
          </button>
        </div>
      </main>
    </div>
  );
}
