interface PublicSkyFormMethods {
	add(Element):void;
	update():void;
}

interface Window {
    skyform?: PublicSkyFormMethods;
}

interface skyformFields {
	add(element:Element, fn:any):void;
	remove(Element):void;
	update(Element):void;
}

interface skyformMethods {
	addHover(element:Element, wrap:Element):void;
	addFocus(element:Element, wrap:Element):void;
	addActive(element:Element, wrap:Element):void;
	moveId(element:Element, wrap:Element):void;
}

interface skyformRadios {
	add(String, any):void;
	update(String):void;
	remove(String,any):void;
}