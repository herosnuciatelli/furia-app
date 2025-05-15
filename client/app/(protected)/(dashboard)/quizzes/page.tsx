import { CreateQuizButton } from "@/components/create-quiz-button";
import { Button } from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {HistoryIcon} from "lucide-react";

export default function QuizzesPage() {
    return (
        <main>
            <Sheet>
                <SheetTrigger asChild><Button variant={"ghost"}><HistoryIcon /></Button></SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Histórico de Quizzes</SheetTitle>
                        <SheetDescription>
                            Visualize todos os quizzes que você realizou ultimamente.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

            <h2>Realizar Quiz</h2>
            <CreateQuizButton />
        </main>
    )
}