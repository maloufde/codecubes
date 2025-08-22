export async function isWebXrAvailable() {
    return navigator.xr && await navigator.xr.isSessionSupported('immersive-vr');
}
