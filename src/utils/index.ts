const simplifyPath = (path:string) => {
    if (!path) return '';
    
    // 检测路径分隔符
    const separator = path.includes('\\') ? '\\' : '/';
    
    // 将路径分割成部分
    const parts = path.split(separator);
    const filename = parts[parts.length - 1];
    
    // 如果路径很长，只保留开头和结尾
    if (parts.length > 4) {
      return parts[0] + separator + '...' + separator + parts[parts.length - 2] + separator + filename;
    }
    
    return path;
};

export { simplifyPath };