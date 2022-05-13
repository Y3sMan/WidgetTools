import {
	createText,
	setTextString,
	getNumCreatedTexts,
	destroyText
} from "skyrimPlatform";
import {
	GetIntValue,
	SetIntValue,
	IntListAdd,
	IntListCount,
	IntListToArray,
	IntListClear,
	StringListAdd,
	StringListToArray
} from "@skyrim-platform/papyrus-util/StorageUtil"

const WidgetToolsKey: string = '.skyrimPlatform.texts'

export const CreateText = function (text: string, StringID: string, modname: string, xpos: number, ypos: number) {
	let text_id: number = createText(xpos, ypos, text, [0, 0.5, 1, 1])
	// 'text' for createText will be used to identify that widget later
	SetIntValue(null, `${WidgetToolsKey}.${modname}.widgets.${StringID}`, text_id)
	IntListAdd(null, `${WidgetToolsKey}.${modname}.widgets`, text_id)
	AddModToList(modname)
}
const GetWidgetID = function (modname: string, StringID: string) {
	return GetIntValue(null, `${WidgetToolsKey}.${modname}.widgets.${StringID}`, -1)
}
export const EditModText = function (text: string, modname:string, StringID: string) {
	setTextString(GetWidgetID(modname, StringID), text)
}
export const DestroyModText = function (text: string, modname:string, StringID: string) {
	destroyText(GetWidgetID(modname, StringID))
}

/**
	Destroys all of a mod's given widgets

	modname: The name of the mod as a string
 */
export const DestroyModWidgets = function (modname: string) {
	if (IntListCount(null, `${WidgetToolsKey}.${modname}.`) == 0 || getNumCreatedTexts() == 0) {
		return;
	}
	let alltexts = IntListToArray(null, `${WidgetToolsKey}.${modname}.`)
	alltexts.forEach(id => {
		destroyText(id)
	});
	IntListClear(null, `${WidgetToolsKey}.${modname}.`)
}

function AddModToList(modname: string) {
	StringListAdd(null, `${WidgetToolsKey}.ModNames.`, modname)	
}
/**
	Returns an array of numbers of all a mod's widgets

	modname: the name of the mod as a string 
 */
export function GetAllTexts(modname: string): number[] {
	return IntListToArray(null, `${WidgetToolsKey}.${modname}`)	
}