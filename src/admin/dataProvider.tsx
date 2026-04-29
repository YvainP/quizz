import type { DataProvider, DeleteResult } from "react-admin";
import { apiFetch } from "../middleware/apiFetcher";

const API_URL = "/api";

function buildUrl(resource: string, id?: number | string) {
  return id ? `${API_URL}/${resource}/${id}` : `${API_URL}/${resource}`;
}

function normalizeOptions(data: any) {
  if (!data.options) return data;

  return {
    ...data,
    options: data.options.map((opt: any) =>
      typeof opt === "string" ? opt : opt.value
    ),
  };
}

export const dataProvider: DataProvider = {
  /* ---------------- GET LIST ---------------- */
  getList: async (resource) => {
    const res = await apiFetch(buildUrl(resource));
    const json = await res.json();

    const data = Array.isArray(json)
      ? json
      : json.data;

    return {
      data: data.map((item: any) => ({
        ...item,
        id: item.id ?? item.lesson_id ?? item.question_id,
      })),
      total: json.total ?? data.length,
    };
  },

  /* ---------------- GET ONE ---------------- */
    getOne: async (resource, params) => {
    const res = await apiFetch(buildUrl(resource, params.id));
    const json = await res.json();

    return {
        data: {
        ...json,
        options: Array.isArray(json.options)
            ? json.options.map((opt: any) =>
                typeof opt === "string" ? { value: opt } : opt
            )
            : [],
        },
    };
    },

  /* ---------------- CREATE ---------------- */
  create: async (resource, params) => {
    const payload = normalizeOptions(params.data);

    const res = await apiFetch(`/api/${resource}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    const record = json.data ?? json;

    return {
      data: {
        ...record,
        id: record.id,
      },
    };
  },

  /* ---------------- UPDATE ---------------- */
  update: async (resource, params) => {
    const payload = normalizeOptions(params.data);

    const res = await apiFetch(`/api/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    const record = json.data ?? json;

    return {
      data: {
        ...record,
        id: record.id ?? params.id,
      },
    };
  },

  /* ---------------- DELETE ---------------- */
    delete: async (resource, params): Promise<DeleteResult> => {
    await apiFetch(`${API_URL}/${resource}/${params.id}`, {
        method: "DELETE",
    });

    return {
        data: (params.previousData ?? { id: params.id }) as any,
    };
    },
  /* ---------------- OPTIONAL ---------------- */
  getMany: async (resource, params) => {
    const res = await apiFetch(buildUrl(resource));
    const json = await res.json();

    return {
      data: json.filter((item: any) =>
        params.ids.includes(item.id)
      ),
    };
  },

  getManyReference: async () => {
    return { data: [], total: 0 };
  },

  updateMany: async () => {
    return { data: [] };
  },

  deleteMany: async () => {
    return { data: [] };
  },
};