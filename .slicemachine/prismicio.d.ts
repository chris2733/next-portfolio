// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismicT from "@prismicio/types";
import type * as prismic from "@prismicio/client";

type Simplify<T> = {
    [KeyType in keyof T]: T[KeyType];
};
/** Content for Homepage documents */
interface HomepageDocumentData {
    /**
     * Slice Zone field in *Homepage*
     *
     * - **Field Type**: Slice Zone
     * - **Placeholder**: *None*
     * - **API ID Path**: homepage.slices[]
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/slices
     *
     */
    slices: prismicT.SliceZone<HomepageDocumentDataSlicesSlice>;
}
/**
 * Slice for *Homepage → Slice Zone*
 *
 */
type HomepageDocumentDataSlicesSlice = TextRepeaterSlice | LinksSlice;
/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> = prismicT.PrismicDocumentWithoutUID<Simplify<HomepageDocumentData>, "homepage", Lang>;
/** Content for Work documents */
interface WorkDocumentData {
    /**
     * Slice Zone field in *Work*
     *
     * - **Field Type**: Slice Zone
     * - **Placeholder**: *None*
     * - **API ID Path**: work.slices[]
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/slices
     *
     */
    slices: prismicT.SliceZone<WorkDocumentDataSlicesSlice>;
}
/**
 * Slice for *Work → Slice Zone*
 *
 */
type WorkDocumentDataSlicesSlice = WorkLinkSlice;
/**
 * Work document from Prismic
 *
 * - **API ID**: `work`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type WorkDocument<Lang extends string = string> = prismicT.PrismicDocumentWithoutUID<Simplify<WorkDocumentData>, "work", Lang>;
export type AllDocumentTypes = HomepageDocument | WorkDocument;
/**
 * Item in Links → Items
 *
 */
export interface LinksSliceDefaultItem {
    /**
     * Link field in *Links → Items*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: links.items[].link
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    link: prismicT.KeyTextField;
}
/**
 * Default variation for Links Slice
 *
 * - **API ID**: `default`
 * - **Description**: `Links`
 * - **Documentation**: https://prismic.io/docs/core-concepts/reusing-slices
 *
 */
export type LinksSliceDefault = prismicT.SharedSliceVariation<"default", Record<string, never>, Simplify<LinksSliceDefaultItem>>;
/**
 * Slice variation for *Links*
 *
 */
type LinksSliceVariation = LinksSliceDefault;
/**
 * Links Shared Slice
 *
 * - **API ID**: `links`
 * - **Description**: `Links`
 * - **Documentation**: https://prismic.io/docs/core-concepts/reusing-slices
 *
 */
export type LinksSlice = prismicT.SharedSlice<"links", LinksSliceVariation>;
/**
 * Item in TextRepeater → Items
 *
 */
export interface TextRepeaterSliceDefaultItem {
    /**
     * Text field in *TextRepeater → Items*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: text_repeater.items[].text
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    text: prismicT.KeyTextField;
}
/**
 * Default variation for TextRepeater Slice
 *
 * - **API ID**: `default`
 * - **Description**: `TextRepeater`
 * - **Documentation**: https://prismic.io/docs/core-concepts/reusing-slices
 *
 */
export type TextRepeaterSliceDefault = prismicT.SharedSliceVariation<"default", Record<string, never>, Simplify<TextRepeaterSliceDefaultItem>>;
/**
 * Slice variation for *TextRepeater*
 *
 */
type TextRepeaterSliceVariation = TextRepeaterSliceDefault;
/**
 * TextRepeater Shared Slice
 *
 * - **API ID**: `text_repeater`
 * - **Description**: `TextRepeater`
 * - **Documentation**: https://prismic.io/docs/core-concepts/reusing-slices
 *
 */
export type TextRepeaterSlice = prismicT.SharedSlice<"text_repeater", TextRepeaterSliceVariation>;
/**
 * Item in Titleseeeee → Items
 *
 */
export interface LandingPageSliceDefaultItem {
    /**
     * Title field in *Titleseeeee → Items*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: landing_page.items[].title
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    title: prismicT.KeyTextField;
}
/**
 * Default variation for Titleseeeee Slice
 *
 * - **API ID**: `default`
 * - **Description**: `LandingPage`
 * - **Documentation**: https://prismic.io/docs/core-concepts/reusing-slices
 *
 */
export type LandingPageSliceDefault = prismicT.SharedSliceVariation<"default", Record<string, never>, Simplify<LandingPageSliceDefaultItem>>;
/**
 * Slice variation for *Titleseeeee*
 *
 */
type LandingPageSliceVariation = LandingPageSliceDefault;
/**
 * Titleseeeee Shared Slice
 *
 * - **API ID**: `landing_page`
 * - **Description**: `LandingPage`
 * - **Documentation**: https://prismic.io/docs/core-concepts/reusing-slices
 *
 */
export type LandingPageSlice = prismicT.SharedSlice<"landing_page", LandingPageSliceVariation>;
/**
 * Primary content in WorkLink → Primary
 *
 */
interface WorkLinkSliceDefaultPrimary {
    /**
     * Title field in *WorkLink → Primary*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: work_link.primary.title
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    title: prismicT.KeyTextField;
    /**
     * Description field in *WorkLink → Primary*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: work_link.primary.description
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    description: prismicT.KeyTextField;
    /**
     * Link field in *WorkLink → Primary*
     *
     * - **Field Type**: Link
     * - **Placeholder**: *None*
     * - **API ID Path**: work_link.primary.link
     * - **Documentation**: https://prismic.io/docs/core-concepts/link-content-relationship
     *
     */
    link: prismicT.LinkField;
}
/**
 * Default variation for WorkLink Slice
 *
 * - **API ID**: `default`
 * - **Description**: `WorkLink`
 * - **Documentation**: https://prismic.io/docs/core-concepts/reusing-slices
 *
 */
export type WorkLinkSliceDefault = prismicT.SharedSliceVariation<"default", Simplify<WorkLinkSliceDefaultPrimary>, never>;
/**
 * Slice variation for *WorkLink*
 *
 */
type WorkLinkSliceVariation = WorkLinkSliceDefault;
/**
 * WorkLink Shared Slice
 *
 * - **API ID**: `work_link`
 * - **Description**: `WorkLink`
 * - **Documentation**: https://prismic.io/docs/core-concepts/reusing-slices
 *
 */
export type WorkLinkSlice = prismicT.SharedSlice<"work_link", WorkLinkSliceVariation>;
declare module "@prismicio/client" {
    interface CreateClient {
        (repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
    }
    namespace Content {
        export type { HomepageDocumentData, HomepageDocumentDataSlicesSlice, HomepageDocument, WorkDocumentData, WorkDocumentDataSlicesSlice, WorkDocument, AllDocumentTypes, LinksSliceDefaultItem, LinksSliceDefault, LinksSliceVariation, LinksSlice, TextRepeaterSliceDefaultItem, TextRepeaterSliceDefault, TextRepeaterSliceVariation, TextRepeaterSlice, LandingPageSliceDefaultItem, LandingPageSliceDefault, LandingPageSliceVariation, LandingPageSlice, WorkLinkSliceDefaultPrimary, WorkLinkSliceDefault, WorkLinkSliceVariation, WorkLinkSlice };
    }
}
