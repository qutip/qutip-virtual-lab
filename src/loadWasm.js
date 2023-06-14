import createModule from './pyjs/pyjs_runtime_browser';

const Module = {}
const makePyJS = async (callback) => {
    const pyjs = await createModule({ print: callback, error: console.error })
    await pyjs.bootstrap_from_empack_packed_environment(
        'empack_env_meta.json',
        './empack',
        false
    )
    return pyjs
}

export default async (callback) => {
    const pyjs = await makePyJS(callback)
    await pyjs.init()
    console.log('loaded pyjs')
    return pyjs
}
