(function(f, g) {
    function Fa() {
        fa = true;
        oa();
        setInterval(oa, 18E4);
        B = ga = document.getElementById("canvas");
        e = B.getContext("2d");
        B.onmousedown = function(a) {
            if (pa) {
                var b = a.clientX - (5 + n / 5 / 2),
                    c = a.clientY - (5 + n / 5 / 2);
                if (Math.sqrt(b * b + c * c) <= n / 5 / 2) {
                    J();
                    C(17);
                    return
                }
            }
            R = a.clientX;
            S = a.clientY;
            ha();
            J()
        };
        B.onmousemove = function(a) {
            R = a.clientX;
            S = a.clientY;
            ha()
        };
        B.onmouseup = function(a) {};
        var a = false,
            b = false,
            c = false;
        f.onkeydown = function(d) {
            32 != d.keyCode || a || (J(), C(17), a = true);
            81 != d.keyCode || b || (C(18), b = true);
            87 != d.keyCode || c || (J(), C(21), c = true);
            27 == d.keyCode && qa(true)
        };
        f.onkeyup = function(d) {
            32 == d.keyCode && (a = false);
            87 == d.keyCode && (c = false);
            81 == d.keyCode && b && (C(19), b = false)
        };
        f.onblur = function() {
            C(19);
            c = b = a = false
        };
        f.onresize = ra;
        ra();
        f.requestAnimationFrame ? f.requestAnimationFrame(sa) : setInterval(ia, 1E3 / 60);
        setInterval(J, 40);
        u && g("#region").val(u);
        ta();
        T(g("#region").val());
        null == l && u && U();
        g("#overlays").show()
    }

    function Ga() {
        if (.5 > h) K = null;
        else {
            for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, d = Number.NEGATIVE_INFINITY, e = 0, p = 0; p < q.length; p++) q[p].shouldRender() && (e = Math.max(q[p].size, e), a = Math.min(q[p].x, a), b = Math.min(q[p].y, b), c = Math.max(q[p].x, c), d = Math.max(q[p].y, d));
            K = QUAD.init({
                minX: a - (e + 100),
                minY: b - (e + 100),
                maxX: c + (e + 100),
                maxY: d + (e + 100)
            });
            for (p = 0; p < q.length; p++)
                if (a = q[p], a.shouldRender())
                    for (b = 0; b < a.points.length; ++b) K.insert(a.points[b])
        }
    }

    function ha() {
        V = (R - n / 2) / h + s;
        W = (S - r / 2) / h + t
    }

    function oa() {
        null == X && (X = {}, g("#region").children().each(function() {
            var a = g(this),
                b = a.val();
            b && (X[b] = a.text())
        }));
        g.get("http://m.agar.io/info",
            function(a) {
                var b = {},
                    c;
                for (c in a.regions) {
                    var d = c.split(":")[0];
                    b[d] = b[d] || 0;
                    b[d] += a.regions[c].numPlayers
                }
                for (c in b) g('#region option[value="' + c + '"]').text(X[c] + " (" + b[c] + " players)")
            }, "json")
    }

    function ua() {
        g("#adsBottom").hide();
        g("#overlays").hide();
        ta()
    }

    function T(a) {
        a && a != u && (g("#region").val() != a && g("#region").val(a), u = f.localStorage.location = a, g(".region-message").hide(), g(".region-message." + a).show(), g(".btn-needs-server").prop("disabled", false), fa && U())
    }

    function qa(a) {
        D = null;
        g("#overlays").fadeIn(a ? 200 : 3E3);
        a || g("#adsBottom").fadeIn(3E3)
    }

    function ta() {
        g("#region").val() ? f.localStorage.location = g("#region").val() : f.localStorage.location && g("#region").val(f.localStorage.location);
        g("#region").val() ? g("#locationKnown").append(g("#region")) : g("#locationUnknown").append(g("#region"))
    }

    function va() {
        console.log("Find " + u + L);
        g.ajax("http://m.agar.io/", {
            error: function() {
                setTimeout(va, 1E3)
            },
            success: function(a) {
                a = a.split("\n");
                wa("ws://" + a[0])
            },
            dataType: "text",
            method: "POST",
            cache: false,
            crossDomain: true,
            data: u +
                L || "?"
        })
    }

    function U() {
        fa && u && (g("#connecting").show(), va())
    }

    function wa(a) {
        if (l) {
            l.onopen = null;
            l.onmessage = null;
            l.onclose = null;
            try {
                l.close()
            } catch (b) {}
            l = null
        }
        E = [];
        k = [];
        y = {};
        q = [];
        F = [];
        A = [];
        v = w = null;
        G = 0;
        console.log("Connecting to " + a);
        l = new WebSocket(a);
        l.binaryType = "arraybuffer";
        l.onopen = Ha;
        l.onmessage = Ia;
        l.onclose = Ja;
        l.onerror = function() {
            console.log("socket error")
        }
    }

    function Ha(a) {
        Y = 500;
        g("#connecting").hide();
        console.log("socket open");
        a = new ArrayBuffer(5);
        var b = new DataView(a);
        b.setUint8(0, 254);
        b.setUint32(1, 3, true);
        l.send(a);
        a = new ArrayBuffer(5);
        b = new DataView(a);
        b.setUint8(0, 255);
        b.setUint32(1, 1, true);
        l.send(a);
        xa()
    }

    function Ja(a) {
        console.log("socket close");
        setTimeout(U, Y);
        Y *= 1.5
    }

    function Ia(a) {
        function b() {
            for (var a = "";;) {
                var b = d.getUint16(c, true);
                c += 2;
                if (0 == b) break;
                a += String.fromCharCode(b)
            }
            return a
        }
        var c = 1,
            d = new DataView(a.data);
        switch (d.getUint8(0)) {
            case 16:
                Ka(d);
                break;
            case 17:
                M = d.getFloat32(1, true);
                N = d.getFloat32(5, true);
                O = d.getFloat32(9, true);
                break;
            case 20:
                k = [];
                E = [];
                break;
            case 32:
                E.push(d.getUint32(1, true));
                break;
            case 49:
                if (null != w) break;
                a = d.getUint32(c, true);
                c += 4;
                A = [];
                for (var e = 0; e < a; ++e) {
                    var p = d.getUint32(c, true),
                        c = c + 4;
                    A.push({
                        id: p,
                        name: b()
                    })
                }
                ya();
                break;
            case 50:
                w = [];
                a = d.getUint32(c, true);
                c += 4;
                for (e = 0; e < a; ++e) w.push(d.getFloat32(c, true)), c += 4;
                ya();
                break;
            case 64:
                Z = d.getFloat64(1, true), $ = d.getFloat64(9, true), aa = d.getFloat64(17, true), ba = d.getFloat64(25, true), M = (aa + Z) / 2, N = (ba + $) / 2, O = 1, 0 == k.length && (s = M, t = N, h = O)
        }
    }

    function Ka(a) {
        H = +new Date;
        var b = Math.random(),
            c = 1;
        ja = false;
        for (var d = a.getUint16(c, true), c = c + 2, e = 0; e < d; ++e) {
            var p =
                y[a.getUint32(c, true)],
                f = y[a.getUint32(c + 4, true)],
                c = c + 8;
            p && f && (f.destroy(), f.ox = f.x, f.oy = f.y, f.oSize = f.size, f.nx = p.x, f.ny = p.y, f.nSize = f.size, f.updateTime = H)
        }
        for (e = 0;;) {
            d = a.getUint32(c, true);
            c += 4;
            if (0 == d) break;
            ++e;
            var g, p = a.getUint16(c, true),
                c = c + 2,
                f = a.getUint16(c, true),
                c = c + 2;
            g = a.getUint16(c, true);
            for (var c = c + 2, h = a.getUint8(c++), l = a.getUint8(c++), n = a.getUint8(c++), h = (h << 16 | l << 8 | n).toString(16); 6 > h.length;) h = "0" + h;
            var h = "#" + h,
                z = a.getUint8(c++),
                l = !!(z & 1),
                n = !!(z & 16);
            z & 2 && (c += 4);
            z & 4 && (c += 8);
            z & 8 && (c += 16);
            for (z = "";;) {
                var m = a.getUint16(c, true),
                    c = c + 2;
                if (0 == m) break;
                z += String.fromCharCode(m)
            }
            m = null;
            y.hasOwnProperty(d) ? (m = y[d], m.updatePos(), m.ox = m.x, m.oy = m.y, m.oSize = m.size, m.color = h) : (m = new za(d, p, f, g, h, z), m.pX = p, m.pY = f);
            m.isVirus = l;
            m.isAgitated = n;
            m.nx = p;
            m.ny = f;
            m.nSize = g;
            m.updateCode = b;
            m.updateTime = H; - 1 != E.indexOf(d) && -1 == k.indexOf(m) && (document.getElementById("overlays").style.display = "none", k.push(m), 1 == k.length && (s = m.x, t = m.y))
        }
        a.getUint16(c, true);
        c += 2;
        p = a.getUint32(c, true);
        c += 4;
        for (e = 0; e < p; e++) d = a.getUint32(c, true), c += 4, y[d] && (y[d].updateCode = b);
        for (e = 0; e < q.length; e++) q[e].updateCode != b && q[e--].destroy();
        ja && 0 == k.length && qa(false)
    }

    function J() {
        if (ka()) {
            var a = R - n / 2,
                b = S - r / 2;
            64 > a * a + b * b || Aa == V && Ba == W || (Aa = V, Ba = W, a = new ArrayBuffer(21), b = new DataView(a), b.setUint8(0, 16), b.setFloat64(1, V, true), b.setFloat64(9, W, true), b.setUint32(17, 0, true), l.send(a))
        }
    }

    function xa() {
        if (ka() && null != D) {
            var a = new ArrayBuffer(1 + 2 * D.length),
                b = new DataView(a);
            b.setUint8(0, 0);
            for (var c = 0; c < D.length; ++c) b.setUint16(1 + 2 * c, D.charCodeAt(c), true);
            l.send(a)
        }
    }

    function ka() {
        return null != l && l.readyState == l.OPEN
    }

    function C(a) {
        if (ka()) {
            var b = new ArrayBuffer(1);
            (new DataView(b)).setUint8(0, a);
            l.send(b)
        }
    }

    function sa() {
        ia();
        f.requestAnimationFrame(sa)
    }

    function ra() {
        n = f.innerWidth;
        r = f.innerHeight;
        ga.width = B.width = n;
        ga.height = B.height = r;
        ia()
    }

    function La() {
        if (0 != k.length) {
            for (var a = 0, b = 0; b < k.length; b++) a += k[b].size;
            a = Math.pow(Math.min(64 / a, 1), .4) * Math.max(r / 1080, n / 1920);
            h = (9 * h + a) / 10
        }
    }

    function ia() {
        var a = +new Date;
        ++Ma;
        H = +new Date;
        if (0 < k.length) {
            La();
            for (var b = 0, c = 0, d = 0; d < k.length; d++) k[d].updatePos(),
                b += k[d].x / k.length, c += k[d].y / k.length;
            M = b;
            N = c;
            O = h;
            s = (s + b) / 2;
            t = (t + c) / 2
        } else s = (29 * s + M) / 30, t = (29 * t + N) / 30, h = (9 * h + O) / 10;
        Ga();
        ha();
        e.clearRect(0, 0, n, r);
        e.fillStyle = la ? "#111111" : "#F2FBFF";
        e.fillRect(0, 0, n, r);
        e.save();
        e.strokeStyle = la ? "#AAAAAA" : "#000000";
        e.globalAlpha = .2;
        e.scale(h, h);
        b = n / h;
        c = r / h;
        for (d = -.5 + (-s + b / 2) % 50; d < b; d += 50) e.beginPath(), e.moveTo(d, 0), e.lineTo(d, c), e.stroke();
        for (d = -.5 + (-t + c / 2) % 50; d < c; d += 50) e.beginPath(), e.moveTo(0, d), e.lineTo(b, d), e.stroke();
        e.restore();
        q.sort(function(a, b) {
            return a.size ==
                b.size ? a.id - b.id : a.size - b.size
        });
        e.save();
        e.translate(n / 2, r / 2);
        e.scale(h, h);
        e.translate(-s, -t);
        preRender();
        for (d = 0; d < F.length; d++) F[d].draw();
        for (d = 0; d < q.length; d++) q[d].draw();

        postRender();
        e.restore();
        v && v.width && e.drawImage(v, n - v.width - 10, 10);
        G = Math.max(G, Na());
        0 != G && (null == ca && (ca = new da(24, "#FFFFFF")), ca.setValue("Score: " + ~~(G / 100)), c = ca.render(), b = c.width, e.globalAlpha = .2, e.fillStyle = "#000000", e.fillRect(10, r - 10 - 24 - 10, b + 10, 34), e.globalAlpha = 1, e.drawImage(c, 15, r - 10 - 24 - 5));
        Oa();
        a = +new Date - a;
        a > 1E3 / 60 ? x -= .01 : a < 1E3 / 65 && (x += .01);.4 > x && (x = .4);
        1 < x && (x = 1)
    }

    function Oa() {
        if (pa && ma.width) {
            var a = n / 5;
            e.drawImage(ma, 5, 5, a, a)
        }
    }

    function Na() {
        for (var a = 0, b = 0; b < k.length; b++) a += k[b].nSize * k[b].nSize;
        return a
    }

    function ya() {
        v = null;
        if (null != w || 0 != A.length)
            if (null != w || ea) {
                v = document.createElement("canvas");
                var a = v.getContext("2d"),
                    b = 60,
                    b = null == w ? b + 24 * A.length : b + 180,
                    c = Math.min(200, .3 * n) / 200;
                v.width = 200 * c;
                v.height = b * c;
                a.scale(c, c);
                a.globalAlpha = .4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, b);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                c = null;
                c = "Leaderboard";
                a.font = "30px Ubuntu";
                a.fillText(c, 100 - a.measureText(c).width / 2, 40);
                if (null == w)
                    for (a.font = "20px Ubuntu", b = 0; b < A.length; ++b) c = A[b].name || "An unnamed cell", ea || (c = "An unnamed cell"), -1 != E.indexOf(A[b].id) ? (k[0].name && (c = k[0].name), a.fillStyle = "#FFAAAA") : a.fillStyle = "#FFFFFF", c = b + 1 + ". " + c, a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);
                else
                    for (b = c = 0; b < w.length; ++b) angEnd = c + w[b] * Math.PI * 2, a.fillStyle = Pa[b + 1], a.beginPath(), a.moveTo(100, 140), a.arc(100, 140, 80, c, angEnd, false), a.fill(), c = angEnd
            }
    }

    function za(a, b, c, d, e, f) {
        q.push(this);
        y[a] = this;
        this.id = a;
        this.ox = this.x = b;
        this.oy = this.y = c;
        this.oSize = this.size = d;
        this.color = e;
        this.points = [];
        this.pointsAcc = [];
        this.createPoints();
        this.setName(f)
    }

    function da(a, b, c, d) {
        a && (this._size = a);
        b && (this._color = b);
        this._stroke = !!c;
        d && (this._strokeColor = d)
    }

    function preRender() {
        if (k.length) {
            var me = getBiggestMe();
            _.each(q, function (player) {
                player.color = getEnemyColor(me, player);
            });
        }
    }

    function getEnemyColor(me, player) {
        if(_.contains(k, player)) {
            return "#000";
        }
        if (player.isVirus || player.size < 20) return player.color;
        if (player.size / 2 > 1.1 * me.size) {
            return "#F00";
        } else if (player.size > 1.1 * me.size) {
            return "#FF0";
        } else if (player.size * 1.1 < me.size / 2) {
            return "#FCC";
        } else if (player.size * 1.1 < me.size) {
            return "#00F";
        } else {
            return "#0F0";
        }
    }

    function postRender() {
        if (k.length) {
            var me = getBiggestMe();
            console.log(me.x, me.y);
            e.save();
            e.lineWidth = 2;
            _.each(q, function(player) {
                if (!player.isVirus && player.size < 20) {
                    return;
                }
                e.strokeStyle = getEnemyColor(me, player);

                e.beginPath();
                var mePt = getAveragePoint(me.points), playerPt = getAveragePoint(player.points);
                e.moveTo(mePt[0], mePt[1]);
                e.lineTo(playerPt[0], playerPt[1]);
                e.stroke();
            });
            e.restore();
        }
    }

    function getBiggestMe() {
        var me;
        _.each(k, function(m){if(!me || m.nSize > me.nSize) me = m});
        return me;
    }

    function getAveragePoint(points) {
        var x = 0,y=0;
        _.each(points, function(point) {x+=point.x;y+=point.y});
        return [x/points.length,y/points.length];
    }

    function getAngle(x1, y1, x2, y2) {
        //Handle vertical and horizontal lines.

        if (x1 == x2) {
            if (y1 < y2) {
                return 271;
                //return 89;
            } else {
                return 89;
            }
        }

        return (Math.round(Math.atan2(-(y1 - y2), -(x1 - x2))/Math.PI*180 + 180));
    }

    if ("agar.io" != f.location.hostname && "localhost" != f.location.hostname && "10.10.2.13" != f.location.hostname) f.location = "http://agar.io/";
    else if (f.top != f) f.top.location = "http://agar.io/";
    else {
        var ga, e, B, n, r, K = null,
            l = null,
            s = 0,
            t = 0,
            E = [],
            k = [],
            y = {},
            q = [],
            F = [],
            A = [],
            R = 0,
            S = 0,
            V = -1,
            W = -1,
            Ma = 0,
            H = 0,
            D = null,
            Z = 0,
            $ = 0,
            aa = 1E4,
            ba = 1E4,
            h = 1,
            u = null,
            Ca = true,
            ea = true,
            na = false,
            ja = false,
            G = 0,
            la = false,
            Da = false,
            M = s = ~~((Z + aa) / 2),
            N = t = ~~(($ + ba) / 2),
            O = 1,
            L = "",
            w = null,
            fa = false,
            P = 0,
            Pa = ["#333333", "#FF3333", "#33FF33", "#3333FF"],
            pa = "ontouchstart" in f && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            ma = new Image;
        ma.src = "img/split.png";
        P = document.createElement("canvas");
        if ("undefined" == typeof console || "undefined" == typeof DataView ||
            "undefined" == typeof WebSocket || null == P || null == P.getContext || null == f.localStorage) alert("You browser does not support this game, we recommend you to use Firefox to play this");
        else {
            var X = null;
            f.get = function(v){return eval(v)};
            f.setNick = function(a) {
                ua();
                D = a;
                xa();
                G = 0
            };
            f.setRegion = T;
            f.setSkins = function(a) {
                Ca = a
            };
            f.setNames = function(a) {
                ea = a
            };
            f.setDarkTheme = function(a) {
                la = a
            };
            f.setColors = function(a) {
                na = a
            };
            f.setShowMass = function(a) {
                Da = a
            };
            f.spectate = function() {
                D = null;
                C(1);
                ua()
            };
            f.setGameMode = function(a) {
                a != L && (L = a, U())
            };
            null != f.localStorage && (null == f.localStorage.AB7 && (f.localStorage.AB7 = 0 + ~~(100 * Math.random())), P = +f.localStorage.AB7, f.ABGroup = P);
            g.get("http://gc.agar.io", function(a) {
                var b = a.split(" ");
                a = b[0];
                b = b[1] || ""; - 1 == "DE IL PL HU BR AT".split(" ").indexOf(a) && Ea.push("nazi");
                Q.hasOwnProperty(a) && ("string" == typeof Q[a] ? u || T(Q[a]) : Q[a].hasOwnProperty(b) && (u || T(Q[a][b])))
            }, "text");
            setTimeout(function() {}, 3E5);
            var Q = {
                AF: "JP-Tokyo",
                AX: "EU-London",
                AL: "EU-London",
                DZ: "EU-London",
                AS: "SG-Singapore",
                AD: "EU-London",
                AO: "EU-London",
                AI: "US-Atlanta",
                AG: "US-Atlanta",
                AR: "BR-Brazil",
                AM: "JP-Tokyo",
                AW: "US-Atlanta",
                AU: "SG-Singapore",
                AT: "EU-London",
                AZ: "JP-Tokyo",
                BS: "US-Atlanta",
                BH: "JP-Tokyo",
                BD: "JP-Tokyo",
                BB: "US-Atlanta",
                BY: "EU-London",
                BE: "EU-London",
                BZ: "US-Atlanta",
                BJ: "EU-London",
                BM: "US-Atlanta",
                BT: "JP-Tokyo",
                BO: "BR-Brazil",
                BQ: "US-Atlanta",
                BA: "EU-London",
                BW: "EU-London",
                BR: "BR-Brazil",
                IO: "JP-Tokyo",
                VG: "US-Atlanta",
                BN: "JP-Tokyo",
                BG: "EU-London",
                BF: "EU-London",
                BI: "EU-London",
                KH: "JP-Tokyo",
                CM: "EU-London",
                CA: "US-Atlanta",
                CV: "EU-London",
                KY: "US-Atlanta",
                CF: "EU-London",
                TD: "EU-London",
                CL: "BR-Brazil",
                CN: "CN-China",
                CX: "JP-Tokyo",
                CC: "JP-Tokyo",
                CO: "BR-Brazil",
                KM: "EU-London",
                CD: "EU-London",
                CG: "EU-London",
                CK: "SG-Singapore",
                CR: "US-Atlanta",
                CI: "EU-London",
                HR: "EU-London",
                CU: "US-Atlanta",
                CW: "US-Atlanta",
                CY: "JP-Tokyo",
                CZ: "EU-London",
                DK: "EU-London",
                DJ: "EU-London",
                DM: "US-Atlanta",
                DO: "US-Atlanta",
                EC: "BR-Brazil",
                EG: "EU-London",
                SV: "US-Atlanta",
                GQ: "EU-London",
                ER: "EU-London",
                EE: "EU-London",
                ET: "EU-London",
                FO: "EU-London",
                FK: "BR-Brazil",
                FJ: "SG-Singapore",
                FI: "EU-London",
                FR: "EU-London",
                GF: "BR-Brazil",
                PF: "SG-Singapore",
                GA: "EU-London",
                GM: "EU-London",
                GE: "JP-Tokyo",
                DE: "EU-London",
                GH: "EU-London",
                GI: "EU-London",
                GR: "EU-London",
                GL: "US-Atlanta",
                GD: "US-Atlanta",
                GP: "US-Atlanta",
                GU: "SG-Singapore",
                GT: "US-Atlanta",
                GG: "EU-London",
                GN: "EU-London",
                GW: "EU-London",
                GY: "BR-Brazil",
                HT: "US-Atlanta",
                VA: "EU-London",
                HN: "US-Atlanta",
                HK: "JP-Tokyo",
                HU: "EU-London",
                IS: "EU-London",
                IN: "JP-Tokyo",
                ID: "JP-Tokyo",
                IR: "JP-Tokyo",
                IQ: "JP-Tokyo",
                IE: "EU-London",
                IM: "EU-London",
                IL: "JP-Tokyo",
                IT: "EU-London",
                JM: "US-Atlanta",
                JP: "JP-Tokyo",
                JE: "EU-London",
                JO: "JP-Tokyo",
                KZ: "JP-Tokyo",
                KE: "EU-London",
                KI: "SG-Singapore",
                KP: "JP-Tokyo",
                KR: "JP-Tokyo",
                KW: "JP-Tokyo",
                KG: "JP-Tokyo",
                LA: "JP-Tokyo",
                LV: "EU-London",
                LB: "JP-Tokyo",
                LS: "EU-London",
                LR: "EU-London",
                LY: "EU-London",
                LI: "EU-London",
                LT: "EU-London",
                LU: "EU-London",
                MO: "JP-Tokyo",
                MK: "EU-London",
                MG: "EU-London",
                MW: "EU-London",
                MY: "JP-Tokyo",
                MV: "JP-Tokyo",
                ML: "EU-London",
                MT: "EU-London",
                MH: "SG-Singapore",
                MQ: "US-Atlanta",
                MR: "EU-London",
                MU: "EU-London",
                YT: "EU-London",
                MX: "US-Atlanta",
                FM: "SG-Singapore",
                MD: "EU-London",
                MC: "EU-London",
                MN: "JP-Tokyo",
                ME: "EU-London",
                MS: "US-Atlanta",
                MA: "EU-London",
                MZ: "EU-London",
                MM: "JP-Tokyo",
                NA: "EU-London",
                NR: "SG-Singapore",
                NP: "JP-Tokyo",
                NL: "EU-London",
                NC: "SG-Singapore",
                NZ: "SG-Singapore",
                NI: "US-Atlanta",
                NE: "EU-London",
                NG: "EU-London",
                NU: "SG-Singapore",
                NF: "SG-Singapore",
                MP: "SG-Singapore",
                NO: "EU-London",
                OM: "JP-Tokyo",
                PK: "JP-Tokyo",
                PW: "SG-Singapore",
                PS: "JP-Tokyo",
                PA: "US-Atlanta",
                PG: "SG-Singapore",
                PY: "BR-Brazil",
                PE: "BR-Brazil",
                PH: "JP-Tokyo",
                PN: "SG-Singapore",
                PL: "EU-London",
                PT: "EU-London",
                PR: "US-Atlanta",
                QA: "JP-Tokyo",
                RE: "EU-London",
                RO: "EU-London",
                RU: "RU-Russia",
                RW: "EU-London",
                BL: "US-Atlanta",
                SH: "EU-London",
                KN: "US-Atlanta",
                LC: "US-Atlanta",
                MF: "US-Atlanta",
                PM: "US-Atlanta",
                VC: "US-Atlanta",
                WS: "SG-Singapore",
                SM: "EU-London",
                ST: "EU-London",
                SA: "EU-London",
                SN: "EU-London",
                RS: "EU-London",
                SC: "EU-London",
                SL: "EU-London",
                SG: "JP-Tokyo",
                SX: "US-Atlanta",
                SK: "EU-London",
                SI: "EU-London",
                SB: "SG-Singapore",
                SO: "EU-London",
                ZA: "EU-London",
                SS: "EU-London",
                ES: "EU-London",
                LK: "JP-Tokyo",
                SD: "EU-London",
                SR: "BR-Brazil",
                SJ: "EU-London",
                SZ: "EU-London",
                SE: "EU-London",
                CH: "EU-London",
                SY: "EU-London",
                TW: "JP-Tokyo",
                TJ: "JP-Tokyo",
                TZ: "EU-London",
                TH: "JP-Tokyo",
                TL: "JP-Tokyo",
                TG: "EU-London",
                TK: "SG-Singapore",
                TO: "SG-Singapore",
                TT: "US-Atlanta",
                TN: "EU-London",
                TR: "TK-Turkey",
                TM: "JP-Tokyo",
                TC: "US-Atlanta",
                TV: "SG-Singapore",
                UG: "EU-London",
                UA: "EU-London",
                AE: "EU-London",
                GB: "EU-London",
                US: {
                    AL: "US-Atlanta",
                    AK: "US-Fremont",
                    AZ: "US-Fremont",
                    AR: "US-Atlanta",
                    CA: "US-Fremont",
                    CO: "US-Fremont",
                    CT: "US-Atlanta",
                    DE: "US-Atlanta",
                    FL: "US-Atlanta",
                    GA: "US-Atlanta",
                    HI: "US-Fremont",
                    ID: "US-Fremont",
                    IL: "US-Atlanta",
                    IN: "US-Atlanta",
                    IA: "US-Atlanta",
                    KS: "US-Atlanta",
                    KY: "US-Atlanta",
                    LA: "US-Atlanta",
                    ME: "US-Atlanta",
                    MD: "US-Atlanta",
                    MA: "US-Atlanta",
                    MI: "US-Atlanta",
                    MN: "US-Fremont",
                    MS: "US-Atlanta",
                    MO: "US-Atlanta",
                    MT: "US-Fremont",
                    NE: "US-Fremont",
                    NV: "US-Fremont",
                    NH: "US-Atlanta",
                    NJ: "US-Atlanta",
                    NM: "US-Fremont",
                    NY: "US-Atlanta",
                    NC: "US-Atlanta",
                    ND: "US-Fremont",
                    OH: "US-Atlanta",
                    OK: "US-Atlanta",
                    OR: "US-Fremont",
                    PA: "US-Atlanta",
                    RI: "US-Atlanta",
                    SC: "US-Atlanta",
                    SD: "US-Fremont",
                    TN: "US-Atlanta",
                    TX: "US-Atlanta",
                    UT: "US-Fremont",
                    VT: "US-Atlanta",
                    VA: "US-Atlanta",
                    WA: "US-Fremont",
                    WV: "US-Atlanta",
                    WI: "US-Atlanta",
                    WY: "US-Fremont",
                    DC: "US-Atlanta",
                    AS: "US-Atlanta",
                    GU: "US-Atlanta",
                    MP: "US-Atlanta",
                    PR: "US-Atlanta",
                    UM: "US-Atlanta",
                    VI: "US-Atlanta"
                },
                UM: "SG-Singapore",
                VI: "US-Atlanta",
                UY: "BR-Brazil",
                UZ: "JP-Tokyo",
                VU: "SG-Singapore",
                VE: "BR-Brazil",
                VN: "JP-Tokyo",
                WF: "SG-Singapore",
                EH: "EU-London",
                YE: "JP-Tokyo",
                ZM: "EU-London",
                ZW: "EU-London"
            };
            f.connect = wa;
            var Y = 500,
                Aa = -1,
                Ba = -1,
                v = null,
                x = 1,
                ca = null,
                I = {},
                Ea = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;ussr;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8".split(";"),
                Qa = ["8", "nasa"],
                Ra = ["m'blob"];
            za.prototype = {
                id: 0,
                points: null,
                pointsAcc: null,
                name: null,
                nameCache: null,
                sizeCache: null,
                x: 0,
                y: 0,
                size: 0,
                ox: 0,
                oy: 0,
                oSize: 0,
                nx: 0,
                ny: 0,
                nSize: 0,
                updateTime: 0,
                updateCode: 0,
                drawTime: 0,
                destroyed: false,
                isVirus: false,
                isAgitated: false,
                wasSimpleDrawing: true,
                onPostRender: _.noop,
                destroy: function() {
                    var a;
                    for (a = 0; a < q.length; a++)
                        if (q[a] == this) {
                            q.splice(a, 1);
                            break
                        }
                    delete y[this.id];
                    a = k.indexOf(this); - 1 != a && (ja = true, k.splice(a, 1));
                    a = E.indexOf(this.id); - 1 != a && E.splice(a, 1);
                    this.destroyed = true;
                    F.push(this)
                },
                getNameSize: function() {
                    return Math.max(~~(.3 * this.size), 24)
                },
                setName: function(a) {
                    if (this.name = a) null == this.nameCache ? this.nameCache = new da(this.getNameSize(), "#FFFFFF", true, "#000000") : this.nameCache.setSize(this.getNameSize()), this.nameCache.setValue(this.name)
                },
                createPoints: function() {
                    for (var a = this.getNumPoints(); this.points.length > a;) {
                        var b = ~~(Math.random() * this.points.length);
                        this.points.splice(b, 1);
                        this.pointsAcc.splice(b, 1)
                    }
                    0 == this.points.length && 0 < a && (this.points.push({
                        c: this,
                        v: this.size,
                        x: this.x,
                        y: this.y
                    }), this.pointsAcc.push(Math.random() - .5));
                    for (; this.points.length < a;) {
                        var b = ~~(Math.random() * this.points.length),
                            c = this.points[b];
                        this.points.splice(b, 0, {
                            c: this,
                            v: c.v,
                            x: c.x,
                            y: c.y
                        });
                        this.pointsAcc.splice(b, 0, this.pointsAcc[b])
                    }
                },
                getNumPoints: function() {
                    var a = 10;
                    20 > this.size && (a = 5);
                    this.isVirus && (a = 30);
                    return ~~Math.max(this.size * h * (this.isVirus ? Math.min(2 * x, 1) : x), a)
                },
                movePoints: function() {
                    this.createPoints();
                    for (var a = this.points, b = this.pointsAcc, c = a.length, d = 0; d < c; ++d) {
                        var e = b[(d - 1 + c) % c],
                            f = b[(d + 1) % c];
                        b[d] += (Math.random() - .5) * (this.isAgitated ? 3 : 1);
                        b[d] *= .7;
                        10 < b[d] && (b[d] = 10); - 10 > b[d] && (b[d] = -10);
                        b[d] = (e + f + 8 * b[d]) / 10
                    }
                    for (var h = this, d = 0; d < c; ++d) {
                        var g = a[d].v,
                            e = a[(d - 1 + c) % c].v,
                            f = a[(d + 1) % c].v;
                        if (15 < this.size && null != K) {
                            var k = false,
                                l = a[d].x,
                                n = a[d].y;
                            K.retrieve2(l - 5, n - 5, 10, 10, function(a) {
                                a.c != h && 25 > (l - a.x) * (l - a.x) + (n - a.y) * (n - a.y) && (k = true)
                            });
                            !k && (a[d].x < Z || a[d].y < $ || a[d].x > aa || a[d].y > ba) && (k = true);
                            k && (0 < b[d] && (b[d] = 0), b[d] -= 1)
                        }
                        g += b[d];
                        0 > g && (g = 0);
                        g = this.isAgitated ? (19 * g + this.size) / 20 : (12 * g + this.size) / 13;
                        a[d].v = (e + f + 8 * g) / 10;
                        e = 2 * Math.PI / c;
                        f = this.points[d].v;
                        this.isVirus && 0 == d % 2 && (f += 5);
                        a[d].x = this.x + Math.cos(e * d) * f;
                        a[d].y = this.y + Math.sin(e * d) * f
                    }
                },
                updatePos: function() {
                    var a;
                    a = (H - this.updateTime) / 120;
                    a = 0 > a ? 0 : 1 < a ? 1 : a;
                    var b = 0 > a ? 0 : 1 < a ? 1 : a;
                    this.getNameSize();
                    if (this.destroyed && 1 <= b) {
                        var c = F.indexOf(this); - 1 != c && F.splice(c, 1)
                    }
                    this.x = a * (this.nx - this.ox) + this.ox;
                    this.y = a * (this.ny - this.oy) + this.oy;
                    this.size = b * (this.nSize - this.oSize) + this.oSize;
                    return b
                },
                shouldRender: function() {
                    return this.x + this.size + 40 < s - n / 2 / h || this.y + this.size + 40 < t - r / 2 / h || this.x - this.size - 40 >
                        s + n / 2 / h || this.y - this.size - 40 > t + r / 2 / h ? false : true
                },
                draw: function() {
                    if (this.shouldRender()) {
                        var a = !this.isVirus && !this.isAgitated && .5 > h;
                        if (this.wasSimpleDrawing && !a)
                            for (var b = 0; b < this.points.length; b++) this.points[b].v = this.size;
                        this.wasSimpleDrawing = a;
                        e.save();
                        this.drawTime = H;
                        b = this.updatePos();
                        this.destroyed && (e.globalAlpha *= 1 - b);
                        e.lineWidth = 10;
                        e.lineCap = "round";
                        e.lineJoin = this.isVirus ? "mitter" : "round";
                        na ? (e.fillStyle = "#FFFFFF", e.strokeStyle = "#AAAAAA") : (e.fillStyle = this.color, e.strokeStyle = this.color);
                        if (a) e.beginPath(), e.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
                        else {
                            this.movePoints();
                            e.beginPath();
                            var c = this.getNumPoints();
                            e.moveTo(this.points[0].x, this.points[0].y);
                            for (b = 1; b <= c; ++b) {
                                var d = b % c;
                                e.lineTo(this.points[d].x, this.points[d].y)
                            }
                        }
                        e.closePath();
                        c = this.name.toLowerCase();
                        !this.isAgitated && Ca && "" == L ? -1 != Ea.indexOf(c) ? (I.hasOwnProperty(c) || (I[c] = new Image, I[c].src = "skins/" + c + ".png"), b = 0 != I[c].width && I[c].complete ? I[c] : null) : b = null : b = null;
                        b = (d = b) ? -1 != Ra.indexOf(c) : false;
                        a || e.stroke();
                        e.fill();
                        null == d || b || (e.save(), e.clip(), e.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), e.restore());
                        (na || 15 < this.size) && !a && (e.strokeStyle = "#000000", e.globalAlpha *= .1, e.stroke());
                        e.globalAlpha = 1;
                        null != d && b && e.drawImage(d, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                        b = -1 != k.indexOf(this);
                        a = ~~this.y;
                        if ((ea || b) && this.name && this.nameCache && (null == d || -1 == Qa.indexOf(c))) {
                            d = this.nameCache;
                            d.setValue(this.name);
                            d.setSize(this.getNameSize());
                            c = Math.ceil(10 * h) / 10;
                            d.setScale(c);
                            var d = d.render(),
                                f = ~~(d.width / c),
                                g = ~~(d.height / c);
                            e.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g);
                            a += d.height / 2 / c + 4
                        }
                        Da && (b || 0 == k.length && (!this.isVirus || this.isAgitated) && 20 < this.size) && (null == this.sizeCache && (this.sizeCache = new da(this.getNameSize() / 2, "#FFFFFF", true, "#000000")), b = this.sizeCache, b.setSize(this.getNameSize() / 2), b.setValue(~~(this.size * this.size / 100)), c = Math.ceil(10 * h) / 10, b.setScale(c), d = b.render(), f = ~~(d.width / c), g = ~~(d.height / c), e.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g));
                        e.restore();
                        this.onPostRender();
                    }
                }
            };
            da.prototype = {
                _value: "",
                _color: "#000000",
                _stroke: false,
                _strokeColor: "#000000",
                _size: 16,
                _canvas: null,
                _ctx: null,
                _dirty: false,
                _scale: 1,
                setSize: function(a) {
                    this._size != a && (this._size = a, this._dirty = true)
                },
                setScale: function(a) {
                    this._scale != a && (this._scale = a, this._dirty = true)
                },
                setColor: function(a) {
                    this._color != a && (this._color = a, this._dirty = true)
                },
                setStroke: function(a) {
                    this._stroke != a && (this._stroke = a, this._dirty = true)
                },
                setStrokeColor: function(a) {
                    this._strokeColor != a && (this._strokeColor = a, this._dirty = true)
                },
                setValue: function(a) {
                    a != this._value && (this._value = a, this._dirty = true)
                },
                render: function() {
                    null == this._canvas && (this._canvas = document.createElement("canvas"), this._ctx = this._canvas.getContext("2d"));
                    if (this._dirty) {
                        this._dirty = false;
                        var a = this._canvas,
                            b = this._ctx,
                            c = this._value,
                            d = this._scale,
                            e = this._size,
                            f = e + "px Ubuntu";
                        b.font = f;
                        var g = b.measureText(c).width,
                            h = ~~(.2 * e);
                        a.width = (g + 6) * d;
                        a.height = (e + h) * d;
                        b.font = f;
                        b.scale(d, d);
                        b.globalAlpha = 1;
                        b.lineWidth = 3;
                        b.strokeStyle = this._strokeColor;
                        b.fillStyle = this._color;
                        this._stroke && b.strokeText(c, 3, e - h / 2);
                        b.fillText(c, 3, e - h / 2)
                    }
                    return this._canvas
                }
            };
            f.onload = Fa
        }
    }
})(window, jQuery);