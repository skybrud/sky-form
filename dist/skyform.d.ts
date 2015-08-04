declare module sky {
    interface PublicSkyFormMethods {
        add(DOMElement: Element): void;
        update(): void;
    }
}
interface Window {
    skyform?: sky.PublicSkyFormMethods;
}
declare module sky {
    interface skyformFields {
        add(element: Element, fn: any): void;
        remove(element: Element): void;
        update(element: Element): void;
    }
    interface skyformMethods {
        addHover(element: Element, wrap: Element): void;
        addFocus(element: Element, wrap: Element): void;
        addActive(element: Element, wrap: Element): void;
        moveId(element: Element, wrap: Element): void;
    }
}
declare module sky {
    interface skyformRadios {
        add(name: String, updatefuncion: any): void;
        update(name: String): void;
        remove(name: String, updatefuncion: any): void;
    }
}
