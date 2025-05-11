import { GridBackground } from "@/components/grid-background";
import { Navbar } from "@/components/navbar";

export default async function Home() {
  return (
    <>
      <Navbar>
        <Navbar.actions />
      </Navbar>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <GridBackground>
          <div className="text-center">
            <span className="text-2xl">Seja membro</span>
            <h2 className="text-6xl font-bold">TORNE-SE UM FURIOSO</h2>
          </div>
        </GridBackground>
      </main>
    </>
  );
}
