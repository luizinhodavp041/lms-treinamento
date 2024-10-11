"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Course } from "@prisma/client";

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
import RichEditor from "@/components/custom/RichEditor";
import { ComboBox } from "../custom/ComboBox";
import FileUpload from "../custom/FileUpload";
import Link from "next/link";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Trash } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Título é obrigatório e deve ter no mínimo 2 caracteres",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: "Categoria é obrigatória",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subategoria é obrigatória",
  }),
  levelId: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().optional(),
});

interface EditCourseFormProps {
  course: Course;
  categories: {
    label: string; // name of category
    value: string; // categoryId
    subCategories: { label: string; value: string }[];
  }[];
  levels: { label: string; value: string }[];
}

const EditCourseForm = ({
  course,
  categories,
  levels,
}: EditCourseFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      subtitle: course.subtitle || "",
      description: course.description || "",
      categoryId: course.categoryId,
      subCategoryId: course.subCategoryId,
      levelId: course.levelId || "",
      imageUrl: course.imageUrl || "",
      price: course.price || undefined,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);
      router.refresh();
      toast.success("Curso atualizado com sucesso");
    } catch (err) {
      console.log("Failed to update the course", err);
      toast.error("Algo deu errado");
    }
  };

  const routes = [
    {
      label: "Informações Básicas",
      path: `/instructor/courses/${course.id}/basic`,
    },
    {
      label: "Módulos",
      path: `/instructor/courses/${course.id}/sections`,
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7">
        <div className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.path} href={route.path} className="flex gap-4">
              <Button variant={pathname === route.path ? "default" : "outline"}>
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
        <div className="flex gap-4 items-start">
          <Button variant="outline">Publicar</Button>
          <Button>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Direção Defensiva, ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Aprenda tudo sobre direção defensiva com apenas UM curso, ..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <RichEditor
                    placeholder="Sobre o que esse curso se trata?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-10">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <ComboBox options={categories} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Subcategoria</FormLabel>
                  <FormControl>
                    <ComboBox
                      options={
                        categories.find(
                          (category) =>
                            category.value === form.watch("categoryId")
                        )?.subCategories || []
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Nível</FormLabel>
                  <FormControl>
                    <ComboBox options={levels} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Imagem do curso</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="courseBanner"
                    page="Edit Course"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="49.99"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-5">
            <Link href="/instructor/courses">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditCourseForm;
