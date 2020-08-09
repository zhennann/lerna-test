import patchRouter from './patch.js';

export default function(Vue) {
  // router
  function patch(router, root) {
    // routes
    Object.defineProperty(router, 'routes', {
      get() {
        return Vue.prototype.$f7.routes;
      },
      set() {
        // donothing, just for writable
      },
    });
    // layout patch
    if (!root) {
      const layout = Vue.prototype.$meta.vueLayout;
      if (layout) {
        if (layout.patchRouter) {
          layout._patchRouter = layout.patchRouter(router);
        } else {
          layout._patchRouter = patchRouter(layout, router);
        }
      }
    }
  }
  Vue.prototype.$Framework7.use({
    create() {
      patch(this.router, true);
    },
  });
  Vue.prototype.$Framework7.View.use({
    create() {
      patch(this.router, false);
    },
  });

  // vue components
  Object.defineProperty(Vue.prototype.$meta, 'vueRoot', {
    get() {
      return Vue.prototype.$f7 ? Vue.prototype.$f7.root[0].__vue__.$root : null;
    },
  });
  Object.defineProperty(Vue.prototype.$meta, 'vueApp', {
    get() {
      const root = Vue.prototype.$meta.vueRoot;
      return root ? root.$refs.app : null;
    },
  });
  Object.defineProperty(Vue.prototype.$meta, 'vueLayout', {
    get() {
      const app = Vue.prototype.$meta.vueApp;
      return app ? app.getLayout() : null;
    },
  });
}
