<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    num: {
      type: Object,
      default: {
        register:0,
        case:0,
        check:0,
        dispatch:0,
        end:0,
        deal:0,
        assist:0,
      }
    }
  },
  render(h, context) {
    const { icon, title, num } = context.props
    const vnodes = []

    if (icon) {
      // vnodes.push(<svg-icon icon-class={icon}/>)
      vnodes.push(<i class={icon}></i>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
      if(title == '待审核' && num.check != 0){
        vnodes.push(<span class='num_stag'>{(num.check)}</span>)
      }
      if(title == '待派遣' && num.dispath != 0){
        console.log('待派遣'+num.dispath)
        vnodes.push(<span class='num_stag'>{(num.dispatch)}</span>)
      }
      if(title == '待结案' && num.end != 0){
        vnodes.push(<span class='num_stag'>{(num.end)}</span>)
      }
      if(title == '待处置' && num.deal != 0){
        vnodes.push(<span class='num_stag'>{(num.deal)}</span>)
      }
      if(title == '待协办申请' && num.assist != 0){
        vnodes.push(<span class='num_stag'>{(num.assist)}</span>)
      }
    }
    return vnodes
  }
}
</script>
