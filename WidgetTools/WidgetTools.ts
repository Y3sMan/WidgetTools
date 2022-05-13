import {
	createText,
	setTextString,
	getNumCreatedTexts,
	destroyText,
	setTextColor,
	getTextColor,
	Utility
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
// [0, 0.5, 1, 1]
export const CreateText = function (text: string, StringID: string, modname: string, xpos: number, ypos: number, color: number[]) {
	let text_id: number = createText(xpos, ypos, text, color)
	SetIntValue(null, `${WidgetToolsKey}.${modname}.widgets.${StringID}`, text_id)
	IntListAdd(null, `${WidgetToolsKey}.${modname}.widgets`, text_id)
	AddModToList(modname)
	return text_id
}
export const GetWidgetID = function (modname: string, StringID: string) {
	return GetIntValue(null, `${WidgetToolsKey}.${modname}.widgets.${StringID}`, -1)
}
export const EditModTextColor = function (color: number[], modname: string, StringID: string) {
	setTextColor(GetWidgetID(modname, StringID), color)
}
export const EditModTextString = function (text: string, modname: string, StringID: string) {
	setTextString(GetWidgetID(modname, StringID), text)
}
export const DestroyModText = function (text: string, modname: string, StringID: string) {
	destroyText(GetWidgetID(modname, StringID))
}

/**
	Destroys all of a mod's given widgets

	modname: The name of the mod as a string
 */
export const DestroyAllModWidgets = function (modname: string) {
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
export function GetModAllTexts(modname: string): number[] {
	return IntListToArray(null, `${WidgetToolsKey}.${modname}`)
}


export const FadeModText = function (modname: string, StringID: string, fadein: boolean) {
	let id = GetWidgetID(modname, StringID)
	let a = getTextColor(id)
	if (!fadein) {
		a[3] = 0 // set alpha to zero, making widget transparent
	}
	else {
		a[3] = 0
	}
	EditModTextColor(a, modname, StringID)
}
export const WaitFadeModText = async (modname: string, StringID: string, fadein: boolean, time: number) => {
	await Utility.wait(time);
	FadeModText(modname, StringID, fadein)
}
export const FadeAllModTexts = function (modname: string, fadein: boolean) {
	const FadeTextInt = function (modname: string, id: number, fadein: boolean) {
		let a = getTextColor(id)
		if (!fadein) {
			a[3] = 0 // set alpha to zero, making widget transparent
		}
		setTextColor(id, a)
	}
	if (IntListCount(null, `${WidgetToolsKey}.${modname}.`) == 0 || getNumCreatedTexts() == 0) {
		return;
	}
	let alltexts = IntListToArray(null, `${WidgetToolsKey}.${modname}.`)
	alltexts.forEach(id => {
		FadeTextInt(modname, id, fadein)
	});
}