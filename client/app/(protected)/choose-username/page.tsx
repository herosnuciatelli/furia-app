"use client";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	username: z
		.string()
		.min(3, "O username deve ter pelo menos 3 caracteres")
		.max(20, "O username deve ter no máximo 20 caracteres")
		.regex(
			/^[A-Za-z][A-Za-z0-9_]*$/,
			"O username deve começar com uma letra e conter apenas letras, números, e sublinhados",
		)
		.refine((name) => !name.includes("__"), {
			message: "Username cannot contain consecutive underscores",
		}),
});

export default function ChooseUsernamePage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});
	const [isPending, startTransition] = React.useTransition();

	const handleSubmit = async ({ username }: z.infer<typeof formSchema>) => {
		startTransition(async () => {
			try {
				const { auth } = createClient();

				const { user } = (await auth.getUser()).data;

				if (!user) throw new Error("Usuário não está autenticado.");

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/create-fan`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email: user.email,
							userId: user.id,
							username,
						}),
					},
				).then((response) => response.json());

				if (!response.success) {
					form.setError(
						"username",
						{ message: response.message },
						{ shouldFocus: true },
					);
					return;
				}

				toast("Username associado com sucesso!");

				setTimeout(redirect("/furia-app"), 300);
			} catch (error) {
				console.log(error);
				toast("Erro ao adicionar o username");
			}
		});
	};

	return (
		<main>
			<MaxWidthWrapper>
				<div className="text-center pt-[10rem] pb-[5rem]">
					<h2 className="text-3xl bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-800 bg-clip-text text-transparent">
						Escolha seu username.
					</h2>
				</div>
				<Form {...form}>
					<form
						className="max-w-xs mx-auto flex flex-col gap-2.5"
						onSubmit={form.handleSubmit(handleSubmit)}
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel className="text-xs">Username</FormLabel>
										<FormControl>
											<Input type="text" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<Button
							className="flex w-full gap-1"
							disabled={isPending}
							isLoading={isPending}
						>
							Usar
						</Button>
					</form>
				</Form>
			</MaxWidthWrapper>
		</main>
	);
}
