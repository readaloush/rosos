class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { kind: 'normal', filter: 'all', selected: [], bakim: false, ingilizce: false, pages: 0, cartOpen: false, step: 'cart', name: '', note: '', orderNo: '' };
  }
  renderVals() {
    const accent = this.props.accent ?? '#2B44FF';
    const st = this.state || {};
    const kind = st.kind || 'normal';
    const filter = st.filter || 'all';
    const sel = Array.isArray(st.selected) ? st.selected : [];
    const pages = st.pages || 0;
    const name = st.name || '';
    const note = st.note || '';
    const kinds = {};
    const list = [
      ['sade', 'Sade', ['ogrenci'], 'normal'],
      ['gece', 'Gece', ['ogrenci', 'freelancer'], 'normal'],
      ['akademik', 'Akademik', ['ogrenci'], 'normal'],
      ['renkli', 'Renkli', ['freelancer'], 'normal'],
      ['galeri', 'Galeri', ['freelancer'], 'normal'],
      ['kurumsal', 'Kurumsal', ['freelancer', 'isletme'], 'normal'],
      ['lezzet', 'Lezzet', ['isletme'], 'normal'],
      ['randevu', 'Randevu', ['isletme'], 'normal'],
      ['terminal', 'Terminal', ['ogrenci', 'freelancer'], 'anim'],
      ['yorunge', 'Yörünge', ['ogrenci'], 'anim'],
      ['serit', 'Şerit', ['freelancer'], 'anim'],
      ['slayt', 'Slayt', ['freelancer'], 'anim'],
      ['sahne', 'Sahne', ['isletme'], 'anim'],
      ['firin', 'Fırın', ['isletme'], 'anim'],
      ['ornek1', 'readaloush.com benzeri', [], 'ornek'],
      ['ornek2', 'Mühendis portföyü benzeri', [], 'ornek'],
      ['ornek3', 'Dijital kartvizit benzeri', [], 'ornek']
    ];
    const fmt = (v) => '₺' + v.toLocaleString('tr-TR');
    const PRICE = { sade: 1500, akademik: 1750, gece: 2000, renkli: 2500, galeri: 2500, kurumsal: 3500, lezzet: 3500, randevu: 4000, terminal: 3000, yorunge: 3000, serit: 3500, slayt: 3500, sahne: 5000, firin: 5000, ornek1: 4000, ornek2: 4500, ornek3: 1250 };
    const cards = {};
    const names = {};
    list.forEach(([id, label, tags, k]) => {
      const name = label;
      const on = sel.indexOf(id) !== -1;
      names[id] = k === 'anim' ? name + ' (animasyonlu)' : name;
      kinds[id] = k;
      cards[id] = {
        show: k === kind && (filter === 'all' || tags.indexOf(filter) !== -1),
        price: fmt(PRICE[id]),
        border: on ? accent : '#E2E4EA',
        btnBg: on ? accent : '#FFFFFF',
        btnColor: on ? '#FFFFFF' : '#101218',
        btnBorder: on ? accent : '#101218',
        label: on ? 'Sepette' : 'Sepete ekle',
        pressed: on ? 'true' : 'false',
        pick: () => this.setState({ selected: on ? sel.filter((x) => x !== id) : sel.concat(id) })
      };
    });
    const chip = (id) => {
      const on = filter === id;
      return {
        bg: on ? '#101218' : '#FFFFFF',
        color: on ? '#FFFFFF' : '#101218',
        border: on ? '#101218' : '#C9CCD6',
        pressed: on ? 'true' : 'false',
        pick: () => this.setState({ filter: id })
      };
    };
    const kindBtn = (id) => {
      const on = kind === id;
      return {
        bg: on ? '#FFFFFF' : 'transparent',
        shadow: on ? '0 1px 3px rgba(16, 18, 24, 0.18)' : 'none',
        pressed: on ? 'true' : 'false',
        pick: () => this.setState({ kind: id })
      };
    };
    const xBtn = (key, on) => ({
      pressed: on ? 'true' : 'false',
      bg: on ? '#101218' : '#FFFFFF',
      color: on ? '#FFFFFF' : '#101218',
      border: on ? '#101218' : '#C9CCD6',
      mark: on ? '✓ ' : '+ ',
      toggle: () => this.setState({ [key]: !on })
    });
    const n = sel.length;
    const siteN = Math.max(1, n);
    const siteTag = siteN > 1 ? ' × ' + siteN + ' site' : '';
    const designSum = sel.reduce((a, id) => a + PRICE[id], 0);
    const ingPrice = st.ingilizce ? 750 * siteN : 0;
    const monthly = st.bakim ? 250 * siteN : 0;
    const total = designSum + ingPrice + pages * 400;
    const lines = [];
    sel.forEach((id) => {
      lines.push({ label: (kinds[id] === 'ornek' ? 'Örnek · ' : 'Tasarım · ') + names[id], sub: kinds[id] === 'anim' ? 'Animasyonlu · tek seferlik' : (kinds[id] === 'ornek' ? 'Gerçek örneğe benzer · tek seferlik' : 'Tek seferlik'), amount: fmt(PRICE[id]), removeLabel: names[id] + ' tasarımını sepetten çıkar', remove: () => this.setState({ selected: sel.filter((x) => x !== id) }) });
    });
    if (st.ingilizce) lines.push({ label: 'İngilizce sürüm' + siteTag, sub: fmt(750) + ' / site · tek seferlik', amount: fmt(ingPrice), removeLabel: 'İngilizce sürümü çıkar', remove: () => this.setState({ ingilizce: false }) });
    if (pages > 0) lines.push({ label: 'Ek sayfa × ' + pages, sub: fmt(400) + ' / sayfa', amount: fmt(pages * 400), removeLabel: 'Ek sayfaları çıkar', remove: () => this.setState({ pages: 0 }) });
    if (st.bakim) lines.push({ label: 'Aylık bakım' + siteTag, sub: fmt(250) + ' / site · her ay', amount: fmt(monthly) + '/ay', removeLabel: 'Aylık bakımı çıkar', remove: () => this.setState({ bakim: false }) });
    const hasItems = lines.length > 0;
    const canConfirm = n > 0 && name.trim().length > 1;
    const genNo = () => {
      const d = new Date();
      const p2 = (x) => String(x).padStart(2, '0');
      return 'RS-' + String(d.getFullYear()).slice(2) + p2(d.getMonth() + 1) + p2(d.getDate()) + '-' + Math.floor(1000 + Math.random() * 9000);
    };
    const orderNo = st.orderNo || '';
    const msg = [
      'Merhaba! rosos üzerinden sipariş vermek istiyorum.',
      '',
      'Sipariş no: ' + orderNo,
      'Ad soyad: ' + name.trim(),
      '',
      'Tasarımlar (' + n + ' site):'
    ];
    sel.forEach((id, i) => msg.push((i + 1) + '. ' + names[id] + ' — ' + fmt(PRICE[id])));
    if (st.ingilizce || pages > 0 || st.bakim) msg.push('', 'Ek hizmetler:');
    if (st.ingilizce) msg.push('- İngilizce sürüm' + siteTag + ': ' + fmt(ingPrice));
    if (pages > 0) msg.push('- Ek sayfa x' + pages + ': ' + fmt(pages * 400));
    if (st.bakim) msg.push('- Aylık bakım' + siteTag + ': ' + fmt(monthly) + '/ay');
    msg.push('', 'Toplam (tek seferlik): ' + fmt(total));
    if (note.trim()) msg.push('Not: ' + note.trim());
    msg.push('', 'Ödeme bilgilerini paylaşır mısınız?');
    const waLink = 'https://wa.me/905526767983?text=' + encodeURIComponent(msg.join('\n'));
    const scrollTo = (id) => {
      this.setState({ cartOpen: false });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    };
    return {
      accent,
      cards,
      k: { normal: kindBtn('normal'), anim: kindBtn('anim') },
      isAnim: kind === 'anim',
      f: { all: chip('all'), ogrenci: chip('ogrenci'), freelancer: chip('freelancer'), isletme: chip('isletme') },
      hasSelected: n > 0,
      noSelected: n === 0,
      selectedName: n > 1 ? n + ' site (' + sel.map((id) => names[id].replace(' (animasyonlu)', '')).join(', ') + ')' : (n === 1 ? names[sel[0]] : ''),
      selectedPrice: fmt(designSum),
      monthlyText: fmt(monthly) + '/ay',
      x: { bakim: xBtn('bakim', !!st.bakim), ingilizce: xBtn('ingilizce', !!st.ingilizce) },
      extraPages: pages,
      pageMinus: () => this.setState({ pages: Math.max(0, pages - 1) }),
      pagePlus: () => this.setState({ pages: Math.min(10, pages + 1) }),
      lines,
      hasItems,
      isEmpty: !hasItems,
      noPkg: hasItems && n === 0,
      totalText: fmt(total),
      hasMonthly: !!st.bakim,
      cartOpen: !!st.cartOpen,
      showFloat: hasItems && !st.cartOpen,
      isCartStep: st.step !== 'done',
      isDoneStep: st.step === 'done',
      cartTitle: st.step === 'done' ? 'Sipariş özeti' : 'Sepetin',
      openCart: () => this.setState({ cartOpen: true }),
      closeCart: () => this.setState({ cartOpen: false }),
      goDesigns: () => scrollTo('tasarimlar'),
      name,
      note,
      onName: (e) => this.setState({ name: e.target.value }),
      onNote: (e) => this.setState({ note: e.target.value }),
      confirm: () => {
        if (!canConfirm) return;
        this.setState({ step: 'done', orderNo: orderNo || genNo() });
      },
      backToCart: () => this.setState({ step: 'cart' }),
      confirmBg: canConfirm ? accent : '#E2E4EA',
      confirmColor: canConfirm ? '#FFFFFF' : '#4B5162',
      confirmCursor: canConfirm ? 'pointer' : 'not-allowed',
      confirmDisabled: canConfirm ? 'false' : 'true',
      confirmHint: n === 0 ? 'Devam etmek için en az bir tasarım seç.' : (canConfirm ? 'Onaylayınca sipariş numaran oluşturulur.' : 'Devam etmek için adını yaz.'),
      orderNo,
      waLink
    };
  }
}

dcMount(Component, 'sayfa', 'app', {});
