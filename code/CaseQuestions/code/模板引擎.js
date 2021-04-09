function tmpl(str, data) {
  var string =
    "var p = []; p.push('" +
    str
      .replace(/[\r\t\n]/g, "")
      .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
      .replace(/<%/g, "');")
      .replace(/%>/g, "p.push('") +
    "');";

  eval(string);

  return p.join("");
}

const temp = `<script type="text/html" id="user_tmpl">
<%for ( var i = 0; i < users.length; i++ ) { %>
    <li>
        <a href="<%=users[i].url%>">
            <%=users[i].name%>
        </a>
    </li>
<% } %>
</script>`;

var users = [
  { name: "Byron", url: "http://localhost" },
  { name: "Casper", url: "http://localhost" },
  { name: "Frank", url: "http://localhost" },
];

console.log(tmpl(temp, users));
