import type {FC} from 'react'
import type {IconType} from 'react-icons/lib'
import {PiGear} from 'react-icons/pi'
import {FaGithub} from 'react-icons/fa'
import {IoMoonOutline} from 'react-icons/io5'
import {IoSunnyOutline} from 'react-icons/io5'
import {BsStars} from 'react-icons/bs'
import {MdOutlineInsertChart} from 'react-icons/md'
import {FaRegTrashAlt} from 'react-icons/fa'
import {BsLightningCharge} from 'react-icons/bs'
import {MdOutlineUploadFile} from 'react-icons/md'

export type IconName =
	| 'gear'
	| 'github'
	| 'moon'
	| 'sun'
	| 'stars'
	| 'chart'
	| 'trash'
	| 'lightning'
	| 'upload'

const icons: Record<IconName, IconType> = {
	gear: PiGear,
	github: FaGithub,
	moon: IoMoonOutline,
	sun: IoSunnyOutline,
	stars: BsStars,
	chart: MdOutlineInsertChart,
	trash: FaRegTrashAlt,
	lightning: BsLightningCharge,
	upload: MdOutlineUploadFile
}

interface Props {
	icon: IconName
}

export const Icon: FC<Props> = ({icon}) => {
	const IconComponent = icons[icon]
	return <IconComponent />
}
