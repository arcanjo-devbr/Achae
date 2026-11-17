import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import {
  FormularioProfissional,
  type DadosFormularioProfissional,
} from "@/componentes/FormularioProfissional";

import {
  lerProfissionaisSalvos,
  editarProfissionalStorage,
} from "@/utils/profissionaisStorage";

import type { Profissional } from "@/types/Profissional";

export default function EditarProfissional() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [profissional, setProfissional] =
    useState<Profissional | null>(null);

  const [valores, setValores] =
    useState<DadosFormularioProfissional>({
      nome: "",
      telefone: "",
      profissao: "",
      categoria: "",
      cidade: "",
      descricaoServicos: "",
    });

  const [status, setStatus] = useState<"Ativo" | "Inativo">("Ativo");
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarProfissional() {
      try {
        const profissionais = await lerProfissionaisSalvos();

        const encontrado = profissionais.find(
          (item: Profissional) => String(item.id) === id,
        );

        if (!encontrado) {
          Alert.alert("Erro", "Profissional não encontrado.");
          router.back();
          return;
        }

        setProfissional(encontrado);

        setValores({
          nome: encontrado.nome,
          telefone: encontrado.telefone ?? "",
          profissao: encontrado.profissao,
          categoria: encontrado.categoria ?? "",
          cidade: encontrado.localizacao,
          descricaoServicos: encontrado.descricao ?? "",
        });

        setStatus(encontrado.status ?? "Ativo");
      } catch (erro) {
        console.error("Erro ao carregar profissional:", erro);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
        router.back();
      } finally {
        setCarregando(false);
      }
    }

    carregarProfissional();
  }, [id]);

  function atualizarCampo(
    campo: keyof DadosFormularioProfissional,
    valor: string,
  ) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
  }

  async function editar() {
    if (!profissional) return;

    const obrigatorios: (keyof DadosFormularioProfissional)[] = [
      "nome",
      "telefone",
      "profissao",
      "categoria",
      "cidade",
    ];

    if (obrigatorios.some((campo) => !valores[campo].trim())) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);

    try {
      await editarProfissionalStorage(profissional, {
        ...valores,
      });

      router.replace("/");
    } catch (erro) {
      console.error("Erro ao editar profissional:", erro);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando || !profissional) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FormularioProfissional
      valores={valores}
      onChangeCampo={atualizarCampo}
      categorias={[
        "Elétrica",
        "Hidráulica",
        "Pintura",
        "Construção",
        "Informática",
        "Limpeza",
        "Manutenção",
        "Outros",
      ]}
      status={status}
      onChangeStatus={setStatus}
      modo="edicao"
      salvando={salvando}
      carregando={carregando}
      onSubmit={editar}
      onCancelar={() => router.back()}
    />
  );
}