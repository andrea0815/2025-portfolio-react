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
    title: any;
    subtitle: any;
    description: any;
    date: any;
    thumbnail?: any;
    topics?: any;
    tags?: any;
    tools?: any;
    gallery?: any[];
    linkText?: any;
    link?: any;
}

export interface Topic {
    name: string;
    tags: Tag[];
}


export interface Tag {
    name: string;
}

export interface Tool {
    name: string;
}


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

            console.log(allItems);

            // Split by content type
            const projects = allItems
                .filter((i) => i.sys.contentType.sys.id === "project")
                .map((i) => ({
                    title: i.fields.title as string,
                    subtitle: i.fields.subtitle as string,
                    description: i.fields.description as string,
                    date: i.fields.date as string,
                    thumbnail: i.fields.thumbnail,
                    topics: i.fields.topics,
                    tags: Array.isArray(i.fields.tags) ? i.fields.tags : [],
                    tools: Array.isArray(i.fields.tools) ? i.fields.tools : [],
                    gallery: Array.isArray(i.fields.gallery) ? i.fields.gallery : [],
                    linkText: i.fields.linkText as string | undefined,
                    link: i.fields.link as string | undefined,
                }));

            const topics = allItems
                .filter((i) => i.sys.contentType.sys.id === "topics")
                .map((i) => ({
                    name: i.fields.name as string,
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
            // console.log(topics);
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
