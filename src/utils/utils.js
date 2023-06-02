function wait(t) {
    return new Promise(e => setTimeout(e, t));
}
export { wait };
