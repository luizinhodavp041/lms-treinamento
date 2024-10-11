"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MuxData, Resource, Section } from "@prisma/client";
import Link from "next/link";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichEditor from "@/components/custom/RichEditor";
import FileUpload from "../custom/FileUpload";
import { Switch } from "@/components/ui/switch";
import ResourceForm from "./ResourceForm";
import MuxPlayer from "@mux/mux-player-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Título é obrigatório e deve ter no mínimo 2 caracteres",
  }),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().optional(),
});

interface EditSectionFormProps {
  section: Section & { resources: Resource[]; muxData?: MuxData | null };
  courseId: string;
  isCompleted: boolean;
}

const EditSectionForm = ({
  section,
  courseId,
  isCompleted,
}: EditSectionFormProps) => {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section.title,
      description: section.description || "",
      videoUrl: section.videoUrl || "",
      isFree: section.isFree,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}`,
        values
      );
      router.refresh();
      toast.success("Módulo atualizado");
    } catch (err) {
      console.log("Failed to update the section", err);
      toast.error("Algo deu errado");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7">
        <Link href={`/instructor/courses/${courseId}/sections`}>
          <Button variant="outline" className="text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos módulos
          </Button>
        </Link>
        <div className="flex gap-4 items-start">
          <Button variant="outline">Publicar</Button>
          <Button>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h1 className="text-xl font-bold">Detalhes do módulo</h1>
      <p className="text-sm font-medium mt-2">
        Complete essa sessão com informações detalhadas, bons vídeos e
        materiais, para dar aos seus alunos a melhor experiência de aprendizado
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Introdução à Direção Defensiva, ..."
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
                    placeholder="Sobre o que esse módulo se trata?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {section.videoUrl && (
            <div className="my-5">
              <MuxPlayer
                playbackId={section.muxData?.playbackId || ""}
                className="md:max-w-[600px]"
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vídeo</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="sectionVideo"
                    page="Edit Section"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Grátis</FormLabel>
                  <FormDescription>
                    Qualquer um pode acessar esse módulo sem pagar nada
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href={`/instructor/courses/${courseId}/sections`}>
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

      <ResourceForm section={section} courseId={courseId} />
    </>
  );
};

export default EditSectionForm;
