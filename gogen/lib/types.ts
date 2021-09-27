import mri from 'mri'
import {API, Context} from './create'

export type Argv = {clone?: true}

export type ParsedArgv = mri.Argv<Argv>

export type Generator = (api: API, context: Context) => Promise<void>

export {VFile} from './vfile'
