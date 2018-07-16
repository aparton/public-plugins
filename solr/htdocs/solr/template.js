// Generated by CoffeeScript 1.12.7
(function() {
  var Assembly, Component, Directive, Part, Registry, next_class_id_idx;

  Directive = (function() {
    function Directive(selector, value, loopvars) {
      var k, m, ref, sk, sv, v;
      this.selector = selector;
      this.loopvars = loopvars;
      if (this.loopvars == null) {
        this.loopvars = [];
      }
      if (typeof value === 'string') {
        this.value = value.split('.');
      } else if ($.isFunction(value)) {
        this.value = value;
      } else {
        for (k in value) {
          v = value[k];
          m = /^(.*)\<\-(.*)$/g.exec(k);
          if (m.length) {
            ref = [m[1], m[2].split(".")], this.loopvar = ref[0], this.list = ref[1];
            this.subs = (function() {
              var results;
              results = [];
              for (sk in v) {
                sv = v[sk];
                results.push(new Directive(sk, sv, this.loopvars.concat([this.loopvar])));
              }
              return results;
            }).call(this);
          }
        }
      }
    }

    Directive.prototype._accessor = function(value, model_context) {
      return ($.inArray(value[0], this.loopvars) !== -1 ? value : model_context.concat(value)).join('.');
    };

    Directive.prototype.emit = function(model_context, view_context) {
      var i, ik, inner, k, len, real, ref, ref1, sub, v, value;
      if (this.loopvar) {
        inner = {};
        ik = this.loopvar + "<-" + this._accessor(this.list, model_context);
        value = {};
        value[ik] = {};
        ref = this.subs;
        for (i = 0, len = ref.length; i < len; i++) {
          sub = ref[i];
          ref1 = sub.emit(model_context, []), k = ref1[0], v = ref1[1];
          value[ik][k] = v;
        }
      } else if ($.isArray(this.value)) {
        value = this._accessor(this.value, model_context);
      } else {
        real = this.value;
        value = function(e) {
          var context, f, j, len1, x;
          context = e.context;
          for (j = 0, len1 = model_context.length; j < len1; j++) {
            x = model_context[j];
            context = context[x];
          }
          f = $.extend({}, e, {
            context: context
          });
          return real.call(this, f);
        };
      }
      return [view_context.concat([this.selector]).join(' '), value];
    };

    return Directive;

  })();

  Component = (function() {
    function Component(registry, spec1, name1) {
      var k, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, v;
      this.registry = registry;
      this.spec = spec1;
      this.name = name1;
      this.template = $($.trim((ref = this.spec.template) != null ? ref : "<div></div>"));
      this.directives = (ref1 = this._directives_from_spec(this.spec)) != null ? ref1 : {};
      this.submap = (ref2 = this.spec.subtemplates) != null ? ref2 : {};
      this.sockets = {};
      ref4 = (ref3 = this.spec.sockets) != null ? ref3 : {};
      for (k in ref4) {
        v = ref4[k];
        this.sockets[v] = k;
      }
      this.config = (ref5 = this.spec.config) != null ? ref5 : {};
      this.postproc = (ref6 = this.spec.postproc) != null ? ref6 : function(el, data) {};
      this.decorate = (ref7 = this.spec.decorate) != null ? ref7 : {};
      this["extends"] = this.spec["extends"];
      this.fixes = this.spec.fixes;
      this.more_fixes = this.spec.more_fixes;
    }

    Component.prototype.resolved = function() {
      var k, parent, ref, v;
      if (this["extends"] != null) {
        parent = this.registry.get(this["extends"]);
        if (parent != null) {
          ref = parent.spec;
          for (k in ref) {
            v = ref[k];
            if (this.spec[k] == null) {
              this.spec[k] = v;
            }
          }
          this.spec["super"] = parent.spec;
        }
        delete this["extends"];
        return new Component(this.registry, this.spec, this.name);
      } else {
        return this;
      }
    };

    Component.prototype.run_preproc = function(data) {
      var ref, spec;
      spec = this.spec;
      if (this.spec.preproc != null) {
        ref = this.spec.preproc(this.spec, data), spec = ref[0], data = ref[1];
      }
      return [new Component(this.registry, spec, this.name), data];
    };

    Component.prototype.emit_directives = function(model_context, view_context) {
      var d, i, k, len, out, ref, ref1, v;
      out = {};
      ref = this.directives;
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        ref1 = d.emit(model_context, view_context), k = ref1[0], v = ref1[1];
        out[k] = v;
      }
      return out;
    };

    Component.prototype._directives_from_spec = function(spec) {
      var k, out, ref, v;
      out = [];
      ref = spec.directives;
      for (k in ref) {
        v = ref[k];
        out.push(new Directive(k, v));
      }
      return out;
    };

    Component.prototype.get_config = function(key, data) {
      if ($.isFunction(this.config[key])) {
        return this.config[key](data);
      } else {
        return this.config[key];
      }
    };

    Component.prototype.submap_get = function() {
      return this.submap;
    };

    Component.prototype.decorate_get = function() {
      return this.decorate;
    };

    Component.prototype.postproc_get = function() {
      return this.postproc;
    };

    Component.prototype.has_socket = function(s) {
      return this.sockets[s] != null;
    };

    Component.prototype.get_socket = function(s) {
      return this.sockets[s];
    };

    Component.prototype.get_fixes = function() {
      return this.fixes;
    };

    Component.prototype.get_more_fixes = function() {
      var i, k, len, ref, ref1, results;
      ref1 = (ref = this.more_fixes) != null ? ref : [];
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        k = ref1[i];
        results.push(this.registry.get(k));
      }
      return results;
    };

    Component.prototype.emit_template = function(klass) {
      var out;
      out = this.template.clone();
      out.addClass(klass);
      return out;
    };

    Component.prototype.get_parent = function() {
      if (this["extends"] != null) {
        this.parent = this.registry.get(this["extends"]);
        this["extends"] = void 0;
      }
      return this.parent;
    };

    Component.prototype.make_part = function(assembly, model_context, base_vc, sub_vc, parent) {
      return new Part(assembly, this, model_context, base_vc, sub_vc, parent);
    };

    Component.prototype.get_all_subs = function(_seen) {
      var i, k, len, out, ref, t, v;
      if (_seen == null) {
        _seen = {};
      }
      out = [];
      ref = this.submap;
      for (k in ref) {
        v = ref[k];
        for (i = 0, len = v.length; i < len; i++) {
          t = v[i];
          if (!_seen[t.template]) {
            out.concat(this.registry.get(t.template).get_all_subs(_seen));
          }
        }
      }
      out.push(this);
      _seen[this.name] = 1;
      return out;
    };

    return Component;

  })();

  next_class_id_idx = 1;

  Part = (function() {
    function Part(assembly1, component, model_context1, base_vc, sub_vc1, parent1) {
      var i, k, len, s, submap, v;
      this.assembly = assembly1;
      this.component = component;
      this.model_context = model_context1;
      this.sub_vc = sub_vc1;
      this.parent = parent1;
      this.children = [];
      if (this.parent != null) {
        this.parent.children.push(this);
      }
      this.klass = "__tmplcl__" + (next_class_id_idx += 1);
      this.view_context = base_vc.concat(this.sub_vc);
      submap = this.component.submap_get();
      this.subs = [];
      for (k in submap) {
        v = submap[k];
        if (!$.isArray(v)) {
          v = [v];
        }
        for (i = 0, len = v.length; i < len; i++) {
          s = v[i];
          this.add_subtemplate(k, s);
        }
      }
    }

    Part.prototype.find_sockets_in_subtree = function(socket, ret) {
      var c, i, len, ref, results;
      if (this.component.has_socket(socket)) {
        ret.push([this, this.component.get_socket(socket)]);
      }
      ref = this.children;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results.push(c.find_sockets_in_subtree(socket, ret));
      }
      return results;
    };

    Part.prototype.find_sockets = function(socket, ret) {
      if (socket != null) {
        if (this.parent) {
          this.parent.find_sockets(socket, ret);
        } else {
          this.find_sockets_in_subtree(socket, ret);
        }
      }
      return [];
    };

    Part.prototype.add_subtemplate = function(k, v) {
      var dest_part, dest_sel, i, len, plug, ref, results, sockets, sub_comp, sub_mc;
      if (k.length && k.charAt(0) === '^') {
        k = k.substring(1);
        plug = k;
      }
      if (typeof v === 'string') {
        v = {
          template: v,
          data: v
        };
      }
      sockets = [];
      this.find_sockets(plug, sockets);
      if (sockets.length === 0) {
        sockets.push([this, k]);
      }
      results = [];
      for (i = 0, len = sockets.length; i < len; i++) {
        ref = sockets[i], dest_part = ref[0], dest_sel = ref[1];
        dest_sel = dest_sel.split(' ');
        if (v.data !== '') {
          sub_mc = this.model_context.concat(v.data.split('.'));
        } else {
          sub_mc = this.model_context;
        }
        sub_comp = this.assembly.registry_get(v.template, sub_mc);
        results.push(dest_part.subs.push(sub_comp.make_part(this.assembly, sub_mc, dest_part.view_context, dest_sel, dest_part)));
      }
      return results;
    };

    Part.prototype.emit_directives = function() {
      var a, b, dirs, i, len, ref, ref1, s;
      dirs = this.component.emit_directives(this.model_context, ["." + this.klass]);
      ref = this.subs;
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        ref1 = s.emit_directives();
        for (a in ref1) {
          b = ref1[a];
          dirs[a] = b;
        }
      }
      return dirs;
    };

    Part.prototype.emit_template = function() {
      var i, len, ref, s, template;
      template = this.component.emit_template(this.klass);
      ref = this.subs;
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        $(s.sub_vc.join(' '), template).append(s.emit_template());
      }
      return template;
    };

    Part.prototype.run_postproc = function(el, data) {
      var fun, i, j, k, len, len1, ref, ref1, ref2, s, sel, sub_data, sub_el;
      ref = this.subs;
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        s.run_postproc(el, data);
      }
      sub_data = data;
      ref1 = this.model_context;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        k = ref1[j];
        sub_data = sub_data[k];
      }
      sub_el = el;
      if (this.sub_vc.length) {
        sub_el = $('.' + this.klass, el);
      }
      ref2 = this.component.decorate_get();
      for (sel in ref2) {
        fun = ref2[sel];
        fun.call(this, $(sel, sub_el), sub_data);
      }
      return this.component.postproc_get().call(this, sub_el, sub_data);
    };

    return Part;

  })();

  Assembly = (function() {
    function Assembly(registry, name1, data1) {
      this.registry = registry;
      this.name = name1;
      this.data = data1;
    }

    Assembly.prototype.get_fixes = function(type, comp) {
      var c, f, fixes, i, j, len, len1, ref, ref1, ref2, sub;
      fixes = [];
      ref = comp.get_all_subs();
      for (i = 0, len = ref.length; i < len; i++) {
        sub = ref[i];
        f = (ref1 = sub.get_fixes()) != null ? ref1[type] : void 0;
        if (f != null) {
          fixes = fixes.concat(f);
        }
        ref2 = comp.get_more_fixes();
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          c = ref2[j];
          fixes = fixes.concat(this.get_fixes(type, c));
        }
      }
      return fixes;
    };

    Assembly.prototype.run_fixes = function(comp, data, trigger) {
      var f, fixes, i, j, k, len, len1, r, ref, tp2_out, tp2_row_out, v;
      data.tp2 = new TextProc2();
      data.tp2_row = new TextProc2();
      fixes = this.get_fixes(trigger != null ? trigger : 'global', comp);
      for (i = 0, len = fixes.length; i < len; i++) {
        f = fixes[i];
        f.call(this, data);
      }
      if (data.table_row != null) {
        ref = data.table_row;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          r = ref[j];
          tp2_row_out = data.tp2_row.run(r.cols);
          for (k in tp2_row_out) {
            v = tp2_row_out[k];
            r[k] = v;
          }
          if (r.cols != null) {
            for (k in tp2_row_out) {
              v = tp2_row_out[k];
              r.cols[k] = v;
            }
          }
        }
      }
      tp2_out = data.tp2.run(data);
      for (k in tp2_out) {
        v = tp2_out[k];
        data[k] = v;
      }
      if (data.cols != null) {
        for (k in tp2_out) {
          v = tp2_out[k];
          data.cols[k] = v;
        }
      }
      return data;
    };

    Assembly.prototype.generate = function(attach) {
      var all_subs, out, root_comp, root_part, template;
      root_comp = this.registry_get(this.name, []);
      this.data = this.run_fixes(root_comp, this.data);
      all_subs = root_comp.get_all_subs();
      root_part = root_comp.make_part(this, [], [], [], void 0);
      template = root_part.emit_template();
      template = template.wrap("<div></div>").parent();
      out = template.render(this.data, root_part.emit_directives());
      if (attach != null) {
        attach(out);
      }
      root_part.run_postproc(out, this.data);
      return out;
    };

    Assembly.prototype._read = function(path) {
      var data, i, k, len, ref;
      data = this.data;
      for (i = 0, len = path.length; i < len; i++) {
        k = path[i];
        data = (ref = data != null ? data[k] : void 0) != null ? ref : void 0;
      }
      return data;
    };

    Assembly.prototype._write = function(path, value) {
      var data;
      if (path.length) {
        data = this._read(path.slice(0, path.length - 1));
        if (data != null) {
          return data[path[path.length - 1]] = value;
        }
      } else {
        return this.data = value;
      }
    };

    Assembly.prototype.registry_get = function(name, model_context) {
      var data, ref, spec;
      data = this._read(model_context);
      ref = this.registry.get(name).run_preproc(data), spec = ref[0], data = ref[1];
      this._write(model_context, data);
      return spec;
    };

    return Assembly;

  })();

  Registry = (function() {
    function Registry(sets) {
      this.registry = {};
      this.register_sets(sets);
    }

    Registry.prototype.register_sets = function(sets) {
      var i, len, results, s;
      results = [];
      for (i = 0, len = sets.length; i < len; i++) {
        s = sets[i];
        results.push(this.register_all(s));
      }
      return results;
    };

    Registry.prototype.register_all = function(specs) {
      var k, results, v;
      results = [];
      for (k in specs) {
        v = specs[k];
        results.push(this.register(k, v));
      }
      return results;
    };

    Registry.prototype.register = function(name, spec) {
      return this.registry[name] = new Component(this, spec, name);
    };

    Registry.prototype.get = function(name) {
      if (this.registry[name] != null) {
        this.registry[name] = this.registry[name].resolved();
      }
      return this.registry[name];
    };

    Registry.prototype.generate = function(name, data, attach) {
      var a;
      a = new Assembly(this, name, data);
      return a.generate(attach);
    };

    Registry.prototype.config = function(name, key, data) {
      return this.get(name).get_config(key, data);
    };

    return Registry;

  })();

  window.Templates = Registry;

}).call(this);
