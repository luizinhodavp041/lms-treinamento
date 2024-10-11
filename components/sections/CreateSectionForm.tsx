"use client";

import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import toast from "react-hot-toast";
import axios from "axios";
import SectionList from "@/components/sections/SectionList";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Título é obrigatório e com no mínimo 2 caracteres",
  }),
});

const CreateSectionForm = ({
  course,
}: {
  course: Course & { sections: Section[] };
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      label: "informações básicas",
      path: `/instructor/courses/${course.id}/basic`,
    },
    { label: "Módulos", path: `/instructor/courses/${course.id}/sections` },
  ];

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${course.id}/sections`,
        values
      );
      router.push(
        `/instructor/courses/${course.id}/sections/${response.data.id}`
      );
      toast.success("Novo módulo criado");
    } catch (err) {
      toast.error("Something went wrong!");
      console.log("Failed to create a new section", err);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      await axios.put(`/api/courses/${course.id}/sections/reorder`, {
        list: updateData,
      });
      toast.success("Módulos reordenados com sucesso");
    } catch (err) {
      console.log("Failed to reorder sections", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="px-10 py-6">
      <div className="flex gap-5">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <Button variant={pathname === route.path ? "default" : "outline"}>
              {route.label}
            </Button>
          </Link>
        ))}
      </div>

      <SectionList
        items={course.sections || []}
        onReorder={onReorder}
        onEdit={(id) =>
          router.push(`/instructor/courses/${course.id}/sections/${id}`)
        }
      />

      <h1 className="text-xl font-bold mt-5">Adicionar novo módulo</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Introdução" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href={`/instructor/courses/${course.id}/basic`}>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Criar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateSectionForm;
