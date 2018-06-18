/**
 *    Created by tomokokawase
 *    On 2018/6/15
 *    阿弥陀佛，没有bug!
 */
export const handleChange =function(key, val){
    this.setState({
        [key]:val
    })
};

/**
 *     componentWillReceiveProps 这个方法不一定是props变化了才触发，
 *     需要先比较再执行
 *     这个方法用于比较非数组类型的props
 *     用于执行通用的比较,忽略数组的变化
 *     完全相等返回false, 不相等返回true
 *
 */
export const compareChange = (old, newProps) => {
    let keys = Object.keys(old);
    let flag = keys.every((key)=>{
        if(!(old[key] instanceof Array)) {
            return old[key]===newProps[key];
        } else {
            return true;
        }
    });
    return !flag;
};