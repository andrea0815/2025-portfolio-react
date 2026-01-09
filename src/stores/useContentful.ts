import { create } from "zustand";
import { client } from "../contentfulClient";

interface ContenfulStore {
    projects: Project[],
    tags: Tag[],
    topics: Topic[],
    tools: Tool[],
    loading: boolean,
    error: any,

    fetchAll: () => void;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    date: Date;
    thumbnail?: any;
    topics?: any;
    tags?: any;
    tools?: any;
    gallery?: any[];
    links: ProjectLink[];
}

export interface Topic {
    name: string;
    tags: Tag[];
    jobDescription: string;
}

export interface Tag {
    name: string;
}

export interface Tool {
    name: string;
}

export type ProjectLink = {
    buttonText: string;
    url: string;
};


// Heler types 
type LinkEntryFields = { fields?: { buttonText?: string; url?: string } };

export const useContentful = create<ContenfulStore>((set) => ({
    projects: [],
    topics: [],
    tags: [],
    tools: [],
    loading: true,
    error: null,

    fetchAll: async () => {
        try {
            const response = await client.getEntries({
                "sys.contentType.sys.id[in]": "project,topics,tags,tool",
            } as Record<string, any>);
            const allItems = response.items;

            // console.log(allItems);

            // Split by content type
            const projects = allItems
                .filter((i) => i.sys.contentType.sys.id === "project")
                .map((i) => ({
                    id: i.sys.id as string,
                    title: i.fields.title as string,
                    slug: createSlug(i.fields.title as string),
                    subtitle: i.fields.subtitle as string,
                    description: i.fields.description as string,
                    date: new Date(i.fields.date as string),
                    thumbnail: i.fields.thumbnail,
                    topics: i.fields.topics,
                    tags: Array.isArray(i.fields.tags) ? i.fields.tags : [],
                    tools: Array.isArray(i.fields.tools) ? i.fields.tools : [],
                    gallery: Array.isArray(i.fields.gallery) ? i.fields.gallery : [],
                    links: Array.isArray(i.fields.links)
                        ? (i.fields.links as LinkEntryFields[]).map((link): ProjectLink => ({
                            buttonText: String(link.fields?.buttonText ?? ""),
                            url: String(link.fields?.url ?? ""),
                        }))
                        : [],
                }))
                .sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                });

            const topics = allItems
                .filter((i) => i.sys.contentType.sys.id === "topics")
                .map((i) => ({
                    name: i.fields.name as string,
                    jobDescription: i.fields.jobDescription as string,
                    tags: Array.isArray(i.fields.tags)
                        ? i.fields.tags.map((tag: any) => ({
                            name: tag.fields.name as string,
                        }))
                        : []
                }));

            const tags = allItems
                .filter((i) => i.sys.contentType.sys.id === "tags")
                .map((i) => ({
                    name: i.fields.name as string
                }));

            const tools = allItems
                .filter((i) => i.sys.contentType.sys.id === "tool")
                .map((i) => ({
                    name: i.fields.name as string
                }));

            // console.log(projects);
            // console.log(tools);
            console.log(topics);
            // console.log(tags);

            set({
                projects,
                topics,
                tags,
                tools,
                loading: false,
            });
        } catch (err) {
            set({
                error: err,
                loading: false,
            });
        }
    },
}));


// Utility function to create slugs from titles

function createSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")                 // split accented characters (you → u + ¨)
        .replace(/[\u0300-\u036f]/g, "")  // remove accents/diacritics
        .replace(/ß/g, "ss")              // handle German ß explicitly
        .replace(/[^a-z0-9]+/g, "-")      // replace non-alphanumeric chars with -
        .replace(/^-+|-+$/g, "");         // trim leading & trailing hyphens
}

